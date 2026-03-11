import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
    constructor(private prisma: PrismaService) { }

    async getProjectLogs(projectId: string, limit = 100) {
        return this.prisma.log.findMany({
            where: { projectId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }

    async getServerLogs(serverId: string, limit = 100) {
        return this.prisma.log.findMany({
            where: { serverId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
    
    async getDeploymentLogs(deploymentId: string, limit = 100) {
        return this.prisma.log.findMany({
            where: { deploymentId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
}
