import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateAgentKey } from '@servermg/auth';

@Injectable()
export class ServersService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; hostname: string; ipAddress: string }) {
        return this.prisma.server.create({
            data: { ...data, agentKey: generateAgentKey() },
        });
    }

    async findAll() {
        return this.prisma.server.findMany({
            include: { _count: { select: { projects: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string) {
        const server = await this.prisma.server.findUnique({
            where: { id },
            include: {
                projects: { select: { id: true, name: true, status: true, framework: true } },
            },
        });
        if (!server) throw new NotFoundException('Server not found');
        return server;
    }

    async updateMetrics(agentKey: string, metrics: any) {
        const server = await this.prisma.server.findUnique({ where: { agentKey } });
        if (!server) throw new NotFoundException('Server not found');

        return this.prisma.server.update({
            where: { agentKey },
            data: {
                cpuUsage: metrics.cpuUsage,
                ramUsage: metrics.ramUsage,
                ramTotal: metrics.ramTotal,
                diskUsage: metrics.diskUsage,
                diskTotal: metrics.diskTotal,
                containerCount: metrics.containerCount,
                status: 'online',
                os: metrics.os,
            },
        });
    }

    async delete(id: string) {
        await this.prisma.server.delete({ where: { id } });
    }

    async getStats() {
        const [total, online, totalProjects] = await Promise.all([
            this.prisma.server.count(),
            this.prisma.server.count({ where: { status: 'online' } }),
            this.prisma.project.count({ where: { status: 'running' } }),
        ]);
        return { totalServers: total, onlineServers: online, runningProjects: totalProjects };
    }
}
