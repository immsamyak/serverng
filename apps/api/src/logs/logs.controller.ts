import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) { }

    @Get('project/:projectId')
    async getProjectLogs(@Param('projectId') projectId: string, @Query('limit') limit: string) {
        return this.logsService.getProjectLogs(projectId, parseInt(limit, 10) || 100);
    }

    @Get('server/:serverId')
    async getServerLogs(@Param('serverId') serverId: string, @Query('limit') limit: string) {
        return this.logsService.getServerLogs(serverId, parseInt(limit, 10) || 100);
    }

    @Get('deployment/:deploymentId')
    async getDeploymentLogs(@Param('deploymentId') deploymentId: string, @Query('limit') limit: string) {
        return this.logsService.getDeploymentLogs(deploymentId, parseInt(limit, 10) || 100);
    }
}
