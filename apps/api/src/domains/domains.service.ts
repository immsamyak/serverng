import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DomainsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; projectId: string }, orgId: string) {
        const project = await this.prisma.project.findFirst({
            where: { id: data.projectId, organizationId: orgId },
        });
        if (!project) throw new NotFoundException('Project not found');

        const exists = await this.prisma.domain.findUnique({ where: { name: data.name } });
        if (exists) throw new ConflictException('Domain already in use');

        return this.prisma.domain.create({
            data: {
                name: data.name,
                projectId: data.projectId,
                verificationToken: crypto.randomBytes(32).toString('hex'),
            },
        });
    }

    async findAll(orgId: string) {
        return this.prisma.domain.findMany({
            where: { project: { organizationId: orgId } },
            include: { project: { select: { name: true, slug: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByProject(projectId: string) {
        return this.prisma.domain.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async verify(id: string) {
        const domain = await this.prisma.domain.findUnique({ where: { id } });
        if (!domain) throw new NotFoundException('Domain not found');
        // In production, verify DNS TXT record
        return this.prisma.domain.update({
            where: { id },
            data: { isVerified: true },
        });
    }

    async delete(id: string) {
        await this.prisma.domain.delete({ where: { id } });
    }
}
