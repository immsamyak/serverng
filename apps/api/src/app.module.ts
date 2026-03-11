import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { DeploymentsModule } from './deployments/deployments.module';
import { ServersModule } from './servers/servers.module';
import { DomainsModule } from './domains/domains.module';
import { DatabasesModule } from './databases/databases.module';
import { LogsModule } from './logs/logs.module';
import { GatewayModule } from './gateway/gateway.module';
import { BillingModule } from './billing/billing.module';
import { TeamsModule } from './teams/teams.module';
import { FilesModule } from './files/files.module';
import { InstallController } from './install.controller';

@Module({
    imports: [
        // Rate limiting
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),
        // Core
        PrismaModule,
        // Features
        AuthModule,
        UsersModule,
        ProjectsModule,
        DeploymentsModule,
        ServersModule,
        DomainsModule,
        DatabasesModule,
        LogsModule,
        FilesModule,
        TeamsModule,
        BillingModule,
        GatewayModule,
    ],
    controllers: [InstallController],
})
export class AppModule { }
