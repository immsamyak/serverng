import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServersService } from './servers.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/decorators';

@ApiTags('Servers')
@ApiBearerAuth()
@Controller('servers')
@UseGuards(JwtAuthGuard)
export class ServersController {
    constructor(private serversService: ServersService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Register a new server' })
    async create(@Body() body: { name: string; hostname: string; ipAddress: string }) {
        const server = await this.serversService.create(body);
        return { success: true, data: server };
    }

    @Get()
    @ApiOperation({ summary: 'List all servers' })
    async findAll() {
        const servers = await this.serversService.findAll();
        return { success: true, data: servers };
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get server statistics' })
    async getStats() {
        const stats = await this.serversService.getStats();
        return { success: true, data: stats };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get server details' })
    async findById(@Param('id') id: string) {
        const server = await this.serversService.findById(id);
        return { success: true, data: server };
    }

    @Post(':agentKey/metrics')
    @ApiOperation({ summary: 'Submit server metrics (agent)' })
    async submitMetrics(@Param('agentKey') agentKey: string, @Body() metrics: any) {
        const server = await this.serversService.updateMetrics(agentKey, metrics);
        return { success: true, data: server };
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @ApiOperation({ summary: 'Remove a server' })
    async delete(@Param('id') id: string) {
        await this.serversService.delete(id);
        return { success: true, message: 'Server removed' };
    }
}
