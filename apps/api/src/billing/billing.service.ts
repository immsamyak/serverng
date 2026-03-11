import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
    constructor(private prisma: PrismaService) { }

    async getSubscription(orgId: string) {
        return this.prisma.billingSubscription.findUnique({
            where: { organizationId: orgId },
        });
    }

    async updateSubscription(orgId: string, plan: string, status: string) {
        const org = await this.prisma.organization.findUnique({ where: { id: orgId } });
        if (!org) throw new NotFoundException('Organization not found');

        await this.prisma.organization.update({
            where: { id: orgId },
            data: { plan },
        });

        return this.prisma.billingSubscription.upsert({
            where: { organizationId: orgId },
            update: { plan, status, updatedAt: new Date() },
            create: {
                organizationId: orgId,
                plan,
                status,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            },
        });
    }
}
