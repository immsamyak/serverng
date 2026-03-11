import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DomainsService } from './domains.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';

@ApiTags('Domains')
@ApiBearerAuth()
@Controller('domains')
@UseGuards(JwtAuthGuard)
export class DomainsController {
    constructor(private domainsService: DomainsService) { }

    @Post()
    @ApiOperation({ summary: 'Add a custom domain' })
    async create(@Body() body: { name: string; projectId: string }, @CurrentUser() user: any) {
        const domain = await this.domainsService.create(body, user.organizationId);
        return { success: true, data: domain };
    }

    @Get()
    @ApiOperation({ summary: 'List all domains' })
    async findAll(@CurrentUser() user: any) {
        const domains = await this.domainsService.findAll(user.organizationId);
        return { success: true, data: domains };
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'List domains for a project' })
    async findByProject(@Param('projectId') projectId: string) {
        const domains = await this.domainsService.findByProject(projectId);
        return { success: true, data: domains };
    }

    @Post(':id/verify')
    @ApiOperation({ summary: 'Verify domain DNS' })
    async verify(@Param('id') id: string) {
        const domain = await this.domainsService.verify(id);
        return { success: true, data: domain };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a domain' })
    async delete(@Param('id') id: string) {
        await this.domainsService.delete(id);
        return { success: true, message: 'Domain removed' };
    }
}
