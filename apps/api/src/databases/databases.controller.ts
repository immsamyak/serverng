import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DatabasesService } from './databases.service';
import { JwtAuthGuard, CurrentUser } from '../auth/decorators';

@ApiTags('Databases')
@ApiBearerAuth()
@Controller('databases')
@UseGuards(JwtAuthGuard)
export class DatabasesController {
    constructor(private databasesService: DatabasesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a managed database' })
    async create(@Body() body: { name: string; engine: string; projectId?: string }, @CurrentUser() user: any) {
        const db = await this.databasesService.create(body, user.organizationId);
        return { success: true, data: db };
    }

    @Get()
    @ApiOperation({ summary: 'List all databases' })
    async findAll(@CurrentUser() user: any) {
        const databases = await this.databasesService.findAll(user.organizationId);
        return { success: true, data: databases };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get database details' })
    async findById(@Param('id') id: string, @CurrentUser() user: any) {
        const db = await this.databasesService.findById(id, user.organizationId);
        return { success: true, data: db };
    }

    @Get(':id/credentials')
    @ApiOperation({ summary: 'Get database connection credentials' })
    async getCredentials(@Param('id') id: string, @CurrentUser() user: any) {
        const creds = await this.databasesService.getCredentials(id, user.organizationId);
        return { success: true, data: creds };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a database' })
    async delete(@Param('id') id: string, @CurrentUser() user: any) {
        await this.databasesService.delete(id, user.organizationId);
        return { success: true, message: 'Database deleted' };
    }
}
