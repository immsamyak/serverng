import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeploymentsService } from './deployments.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';

@ApiTags('Deployments')
@ApiBearerAuth()
@Controller('deployments')
@UseGuards(JwtAuthGuard)
export class DeploymentsController {
    constructor(private deploymentsService: DeploymentsService) { }

    @Post('project/:projectId')
    @ApiOperation({ summary: 'Trigger a new deployment' })
    async create(@Param('projectId') projectId: string, @Body() body: any, @CurrentUser() user: any) {
        const deployment = await this.deploymentsService.create(projectId, user.id, body.branch);
        return { success: true, data: deployment };
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'List deployments for a project' })
    async findByProject(@Param('projectId') projectId: string, @Query('page') page?: string) {
        const result = await this.deploymentsService.findAll(projectId, parseInt(page || '1'));
        return { success: true, data: result.deployments, meta: { total: result.total, page: result.page } };
    }

    @Get('recent')
    @ApiOperation({ summary: 'Get recent deployments' })
    async recent(@CurrentUser() user: any) {
        const deployments = await this.deploymentsService.getRecentDeployments(user.organizationId);
        return { success: true, data: deployments };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get deployment details' })
    async findById(@Param('id') id: string) {
        const deployment = await this.deploymentsService.findById(id);
        return { success: true, data: deployment };
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel a deployment' })
    async cancel(@Param('id') id: string) {
        const deployment = await this.deploymentsService.cancel(id);
        return { success: true, data: deployment };
    }
}
