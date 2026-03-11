import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
    constructor(private prisma: PrismaService) { }

    async getMembers(orgId: string) {
        return this.prisma.teamMember.findMany({
            where: { organizationId: orgId },
            include: { user: { select: { name: true, email: true, avatar: true } } },
            orderBy: { joinedAt: 'asc' },
        });
    }

    async inviteMember(orgId: string, email: string, role: string, inviterId: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundException('User not found');

        const existing = await this.prisma.teamMember.findUnique({
            where: { userId_organizationId: { userId: user.id, organizationId: orgId } },
        });
        if (existing) throw new ConflictException('User is already in the team');

        return this.prisma.teamMember.create({
            data: {
                userId: user.id,
                organizationId: orgId,
                role,
                invitedBy: inviterId,
            },
        });
    }

    async updateRole(orgId: string, userId: string, role: string) {
        const member = await this.prisma.teamMember.findUnique({
            where: { userId_organizationId: { userId, organizationId: orgId } },
        });
        if (!member) throw new NotFoundException('Member not found in team');

        return this.prisma.teamMember.update({
            where: { userId_organizationId: { userId, organizationId: orgId } },
            data: { role },
        });
    }

    async removeMember(orgId: string, userId: string) {
        const member = await this.prisma.teamMember.findUnique({
            where: { userId_organizationId: { userId, organizationId: orgId } },
        });
        if (!member) throw new NotFoundException('Member not found in team');

        await this.prisma.teamMember.delete({
            where: { userId_organizationId: { userId, organizationId: orgId } },
        });
        return { success: true };
    }
}
