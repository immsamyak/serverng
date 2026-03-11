import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any, orgId: string) {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const project = await this.prisma.project.create({
            data: {
                name: data.name,
                slug: `${slug}-${Date.now().toString(36)}`,
                description: data.description,
                gitUrl: data.gitUrl,
                branch: data.branch || 'main',
                framework: data.framework || 'nodejs',
                buildCommand: data.buildCommand,
                startCommand: data.startCommand,
                port: data.port || 3000,
                organizationId: orgId,
            },
        });

        // Create env vars if provided
        if (data.envVars && typeof data.envVars === 'object') {
            const entries = Object.entries(data.envVars);
            for (const [key, value] of entries) {
                await this.prisma.environmentVariable.create({
                    data: { key, value: value as string, projectId: project.id },
                });
            }
        }

        return project;
    }

    async findAll(orgId: string, page = 1, limit = 20) {
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where: { organizationId: orgId },
                include: {
                    _count: { select: { deployments: true, domains: true } },
                    server: { select: { name: true, ipAddress: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.project.count({ where: { organizationId: orgId } }),
        ]);
        return { projects, total, page, limit };
    }

    async findById(id: string, orgId: string) {
        const project = await this.prisma.project.findFirst({
            where: { id, organizationId: orgId },
            include: {
                domains: true,
                envVars: true,
                server: { select: { name: true, ipAddress: true, status: true } },
                deployments: { take: 5, orderBy: { createdAt: 'desc' } },
                _count: { select: { deployments: true, domains: true, databases: true } },
            },
        });
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async update(id: string, data: any, orgId: string) {
        const project = await this.prisma.project.findFirst({ where: { id, organizationId: orgId } });
        if (!project) throw new NotFoundException('Project not found');

        return this.prisma.project.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                branch: data.branch,
                framework: data.framework,
                buildCommand: data.buildCommand,
                startCommand: data.startCommand,
                port: data.port,
            },
        });
    }

    async delete(id: string, orgId: string) {
        const project = await this.prisma.project.findFirst({ where: { id, organizationId: orgId } });
        if (!project) throw new NotFoundException('Project not found');
        await this.prisma.project.delete({ where: { id } });
    }

    async getEnvVars(projectId: string, orgId: string) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
        if (!project) throw new NotFoundException('Project not found');
        return this.prisma.environmentVariable.findMany({ where: { projectId } });
    }

    async setEnvVar(projectId: string, key: string, value: string, orgId: string) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
        if (!project) throw new NotFoundException('Project not found');

        return this.prisma.environmentVariable.upsert({
            where: { key_projectId: { key, projectId } },
            update: { value },
            create: { key, value, projectId },
        });
    }

    async deleteEnvVar(projectId: string, key: string, orgId: string) {
        const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId: orgId } });
        if (!project) throw new NotFoundException('Project not found');
        await this.prisma.environmentVariable.delete({
            where: { key_projectId: { key, projectId } },
        });
    }
}
