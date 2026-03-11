import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
    private readonly basePath = process.env.PROJECTS_DATA_DIR || '/var/servermg/projects';

    async listFiles(projectId: string, dir = '') {
        const fullPath = path.join(this.basePath, projectId, dir);
        try {
            const entries = await fs.readdir(fullPath, { withFileTypes: true });
            return entries.map(e => ({
                name: e.name,
                isDirectory: e.isDirectory(),
                path: path.join(dir, e.name),
            }));
        } catch (e) {
            return [];
        }
    }

    async getFileContent(projectId: string, filePath: string) {
        const fullPath = path.join(this.basePath, projectId, filePath);
        try {
            const content = await fs.readFile(fullPath, 'utf8');
            return { content };
        } catch (e) {
            throw new NotFoundException('File not found');
        }
    }

    async updateFile(projectId: string, filePath: string, content: string) {
        const fullPath = path.join(this.basePath, projectId, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        return { success: true };
    }

    async deleteFile(projectId: string, filePath: string) {
        const fullPath = path.join(this.basePath, projectId, filePath);
        try {
            await fs.rm(fullPath, { recursive: true, force: true });
            return { success: true };
        } catch (e) {
            throw new NotFoundException('File not found');
        }
    }
}
