import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @Get(':projectId')
    async listFiles(@Param('projectId') projectId: string, @Query('dir') dir: string) {
        return this.filesService.listFiles(projectId, dir || '');
    }

    @Get(':projectId/content')
    async getFileContent(@Param('projectId') projectId: string, @Query('path') filePath: string) {
        return this.filesService.getFileContent(projectId, filePath);
    }

    @Put(':projectId/content')
    async updateFile(@Param('projectId') projectId: string, @Body() body: { path: string; content: string }) {
        return this.filesService.updateFile(projectId, body.path, body.content);
    }

    @Delete(':projectId')
    async deleteFile(@Param('projectId') projectId: string, @Query('path') filePath: string) {
        return this.filesService.deleteFile(projectId, filePath);
    }
}
