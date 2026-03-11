import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DatabasesService {
    constructor(private prisma: PrismaService) { }

    private generateCredentials(engine: string) {
        const username = `user_${crypto.randomBytes(4).toString('hex')}`;
        const password = crypto.randomBytes(16).toString('hex');
        const dbName = `db_${crypto.randomBytes(4).toString('hex')}`;

        const portMap: Record<string, number> = {
            postgresql: 5432,
            mysql: 3306,
            mongodb: 27017,
            redis: 6379,
        };

        return {
            username,
            password,
            databaseName: dbName,
            host: 'localhost',
            port: portMap[engine] || 5432,
        };
    }

    async create(data: { name: string; engine: string; projectId?: string }, orgId: string) {
        const creds = this.generateCredentials(data.engine);

        return this.prisma.database.create({
            data: {
                name: data.name,
                engine: data.engine,
                ...creds,
                projectId: data.projectId,
                organizationId: orgId,
            },
        });
    }

    async findAll(orgId: string) {
        return this.prisma.database.findMany({
            where: { organizationId: orgId },
            include: { project: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string, orgId: string) {
        const db = await this.prisma.database.findFirst({
            where: { id, organizationId: orgId },
            include: { project: { select: { name: true } } },
        });
        if (!db) throw new NotFoundException('Database not found');
        return db;
    }

    async getCredentials(id: string, orgId: string) {
        const db = await this.findById(id, orgId);
        return {
            engine: db.engine,
            host: db.host,
            port: db.port,
            username: db.username,
            password: db.password,
            database: db.databaseName,
            connectionString: this.buildConnectionString(db),
        };
    }

    private buildConnectionString(db: any): string {
        switch (db.engine) {
            case 'postgresql':
                return `postgresql://${db.username}:${db.password}@${db.host}:${db.port}/${db.databaseName}`;
            case 'mysql':
                return `mysql://${db.username}:${db.password}@${db.host}:${db.port}/${db.databaseName}`;
            case 'mongodb':
                return `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.databaseName}`;
            case 'redis':
                return `redis://:${db.password}@${db.host}:${db.port}`;
            default:
                return '';
        }
    }

    async delete(id: string, orgId: string) {
        const db = await this.findById(id, orgId);
        await this.prisma.database.delete({ where: { id } });
    }
}
