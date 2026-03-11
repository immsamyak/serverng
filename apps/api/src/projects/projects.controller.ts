import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    async create(@Body() body: any, @CurrentUser() user: any) {
        const project = await this.projectsService.create(body, user.organizationId);
        return { success: true, data: project };
    }

    @Get()
    @ApiOperation({ summary: 'List all projects' })
    async findAll(@CurrentUser() user: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        const result = await this.projectsService.findAll(user.organizationId, parseInt(page || '1'), parseInt(limit || '20'));
        return { success: true, data: result.projects, meta: { total: result.total, page: result.page, limit: result.limit } };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get project by ID' })
    async findById(@Param('id') id: string, @CurrentUser() user: any) {
        const project = await this.projectsService.findById(id, user.organizationId);
        return { success: true, data: project };
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    async update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
        const project = await this.projectsService.update(id, body, user.organizationId);
        return { success: true, data: project };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project' })
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        await this.projectsService.delete(id, user.organizationId);
        return { success: true, message: 'Project deleted' };
    }

    @Get(':id/env')
    @ApiOperation({ summary: 'Get project environment variables' })
    async getEnvVars(@Param('id') id: string, @CurrentUser() user: any) {
        const envVars = await this.projectsService.getEnvVars(id, user.organizationId);
        return { success: true, data: envVars };
    }

    @Post(':id/env')
    @ApiOperation({ summary: 'Set environment variable' })
    async setEnvVar(@Param('id') id: string, @Body() body: { key: string; value: string }, @CurrentUser() user: any) {
        const envVar = await this.projectsService.setEnvVar(id, body.key, body.value, user.organizationId);
        return { success: true, data: envVar };
    }

    @Delete(':id/env/:key')
    @ApiOperation({ summary: 'Delete environment variable' })
    async deleteEnvVar(@Param('id') id: string, @Param('key') key: string, @CurrentUser() user: any) {
        await this.projectsService.deleteEnvVar(id, key, user.organizationId);
        return { success: true, message: 'Environment variable deleted' };
    }
}
