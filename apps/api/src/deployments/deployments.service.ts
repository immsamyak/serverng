import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeploymentsService {
    constructor(private prisma: PrismaService) { }

    async create(projectId: string, userId: string, branch?: string) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');

        const deployment = await this.prisma.deployment.create({
            data: {
                projectId,
                branch: branch || project.branch,
                status: 'queued',
                triggeredBy: userId,
            },
        });

        // Update project status
        await this.prisma.project.update({
            where: { id: projectId },
            data: { status: 'queued' },
        });

        // Create log entry
        await this.prisma.log.create({
            data: {
                type: 'deploy',
                message: `Deployment ${deployment.id} queued for project ${project.name}`,
                source: 'deployment-service',
                level: 'info',
                projectId,
                deploymentId: deployment.id,
            },
        });

        return deployment;
    }

    async findAll(projectId: string, page = 1, limit = 20) {
        const [deployments, total] = await Promise.all([
            this.prisma.deployment.findMany({
                where: { projectId },
                include: {
                    user: { select: { name: true, email: true, avatar: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.deployment.count({ where: { projectId } }),
        ]);
        return { deployments, total, page, limit };
    }

    async findById(id: string) {
        const deployment = await this.prisma.deployment.findUnique({
            where: { id },
            include: {
                project: { select: { name: true, slug: true, framework: true } },
                user: { select: { name: true, email: true } },
                logs: { orderBy: { timestamp: 'desc' }, take: 100 },
            },
        });
        if (!deployment) throw new NotFoundException('Deployment not found');
        return deployment;
    }

    async updateStatus(id: string, status: string, buildLogs?: string, buildDuration?: number) {
        const deployment = await this.prisma.deployment.update({
            where: { id },
            data: {
                status,
                ...(buildLogs && { buildLogs }),
                ...(buildDuration && { buildDuration }),
            },
        });

        // Update project status
        await this.prisma.project.update({
            where: { id: deployment.projectId },
            data: { status },
        });

        return deployment;
    }

    async cancel(id: string) {
        return this.updateStatus(id, 'cancelled');
    }

    async getRecentDeployments(orgId: string, limit = 10) {
        return this.prisma.deployment.findMany({
            where: { project: { organizationId: orgId } },
            include: {
                project: { select: { name: true, slug: true } },
                user: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
