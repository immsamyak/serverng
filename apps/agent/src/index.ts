import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import * as si from 'systeminformation';
import Docker from 'dockerode';
import dotenv from 'dotenv';
import { createLogger } from '@servermg/logger';
import { ServerMetrics, WsEvent } from '@servermg/shared-types';

dotenv.config();

const logger = createLogger('agent');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const API_URL = process.env.API_URL || 'http://localhost:4000/api';
const AGENT_KEY = process.env.AGENT_KEY;

if (!AGENT_KEY) {
    logger.error('AGENT_KEY environment variable is missing.');
    process.exit(1);
}

class Agent {
    private socket: Socket;
    private metricsInterval: NodeJS.Timeout | null = null;
    
    constructor() {
        const wsUrl = API_URL.replace('http', 'ws').replace('/api', '');
        
        logger.info(`Connecting to ServerMG API at ${API_URL}`);
        
        this.socket = io(wsUrl, {
            query: { agentKey: AGENT_KEY },
            transports: ['websocket'],
            reconnectionDelayMax: 10000,
        });

        this.setupSocket();
    }

    private setupSocket() {
        this.socket.on('connect', () => {
            logger.info('Connected to ServerMG Master.');
            this.startMetricsReporting();
        });

        this.socket.on('disconnect', () => {
            logger.warn('Disconnected from ServerMG Master.');
            if (this.metricsInterval) clearInterval(this.metricsInterval);
        });

        this.socket.on('connect_error', (err) => {
            logger.error(`Connection error: ${err.message}`);
        });
        
        // Listen for remote terminal execution commands
        this.socket.on('execute', async (data: { command: string, replyTo: string }) => {
            // Simplified execution handler (security considerations required for production)
            logger.info(`Received execute command: ${data.command}`);
        });
    }

    private async collectMetrics(): Promise<ServerMetrics> {
        try {
            const [cpu, mem, fs, os, containersData] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.fsSize(),
                si.osInfo(),
                docker.listContainers({ all: true })
            ]);

            const rootFs = fs.find(f => f.mount === '/') || fs[0];

            return {
                cpuUsage: parseFloat(cpu.currentLoad.toFixed(2)),
                ramUsage: parseFloat((mem.active / (1024 ** 3)).toFixed(2)), // GB
                ramTotal: parseFloat((mem.total / (1024 ** 3)).toFixed(2)), // GB
                diskUsage: rootFs ? parseFloat((rootFs.used / (1024 ** 3)).toFixed(2)) : 0, // GB
                diskTotal: rootFs ? parseFloat((rootFs.size / (1024 ** 3)).toFixed(2)) : 0, // GB
                uptime: await si.time().uptime,
                containerCount: containersData.length,
                timestamp: new Date(),
                containers: containersData.map(c => ({
                    id: c.Id.substring(0, 12),
                    name: c.Names[0].replace('/', ''),
                    status: c.State,
                    cpuPercent: 0, // Needs separate calc
                    memoryUsage: 0, // Needs separate calc
                    memoryLimit: 0,
                    ports: c.Ports.map(p => `${p.PublicPort || p.PrivatePort}`).filter(Boolean)
                }))
            };
        } catch (error: any) {
            logger.error(`Error collecting metrics: ${error.message}`);
            throw error;
        }
    }

    private async reportMetrics() {
        try {
            const metrics = await this.collectMetrics();
            
            // Send via HTTP REST
            await axios.post(`${API_URL}/servers/${AGENT_KEY}/metrics`, {
                ...metrics,
                os: `${(await si.osInfo()).distro} ${(await si.osInfo()).release}`
            });
            
            // Also emit via websocket for real-time dashboards
            this.socket.emit(WsEvent.METRICS_UPDATE, metrics);
            
        } catch (error: any) {
            logger.error(`Failed to report metrics: ${error.message}`);
        }
    }

    private startMetricsReporting() {
        if (this.metricsInterval) clearInterval(this.metricsInterval);
        
        // Report immediately
        this.reportMetrics();
        
        // Then every 30 seconds
        this.metricsInterval = setInterval(() => this.reportMetrics(), 30000);
    }
}

// Start agent
const agent = new Agent();

// Handle graceful shutdown
process.on('SIGINT', () => {
    logger.info('Agent shutting down...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger.info('Agent shutting down...');
    process.exit(0);
});
