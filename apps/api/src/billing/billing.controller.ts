import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Get('subscription')
    async getSubscription(@Req() req: any) {
        return this.billingService.getSubscription(req.user.organizationId);
    }

    @Post('subscription')
    async updateSubscription(@Req() req: any, @Body() body: { plan: string; status: string }) {
        return this.billingService.updateSubscription(req.user.organizationId, body.plan, body.status);
    }
}
