import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Get()
    async getMembers(@Req() req: any) {
        return this.teamsService.getMembers(req.user.organizationId);
    }

    @Post()
    async inviteMember(@Req() req: any, @Body() body: { email: string; role: string }) {
        return this.teamsService.inviteMember(
            req.user.organizationId,
            body.email,
            body.role || 'member',
            req.user.id
        );
    }

    @Put(':userId')
    async updateRole(@Req() req: any, @Param('userId') userId: string, @Body() body: { role: string }) {
        return this.teamsService.updateRole(req.user.organizationId, userId, body.role);
    }

    @Delete(':userId')
    async removeMember(@Req() req: any, @Param('userId') userId: string) {
        return this.teamsService.removeMember(req.user.organizationId, userId);
    }
}
