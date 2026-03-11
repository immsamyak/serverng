import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '@servermg/auth';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true, email: true, name: true, avatar: true, role: true,
                organizationId: true, githubId: true, apiToken: true,
                createdAt: true, updatedAt: true,
                organization: { select: { id: true, name: true, slug: true, plan: true } },
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(id: string, data: { name?: string; avatar?: string }) {
        return this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, name: true, avatar: true, role: true },
        });
    }

    async changePassword(id: string, newPassword: string) {
        const hashed = await hashPassword(newPassword);
        await this.prisma.user.update({
            where: { id },
            data: { password: hashed },
        });
    }

    async listUsers(orgId: string) {
        return this.prisma.user.findMany({
            where: { organizationId: orgId },
            select: {
                id: true, email: true, name: true, avatar: true, role: true, createdAt: true,
            },
        });
    }

    async listAllUsers(page = 1, limit = 20) {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true, email: true, name: true, role: true,
                    organizationId: true, createdAt: true,
                    organization: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);
        return { users, total, page, limit };
    }
}
