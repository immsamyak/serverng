import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create default organization
    const org = await prisma.organization.upsert({
        where: { slug: 'default' },
        update: {},
        create: {
            name: 'Default Organization',
            slug: 'default',
            plan: 'pro',
            ownerId: 'system',
        },
    });

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@servermg.com' },
        update: {},
        create: {
            email: 'admin@servermg.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
            organizationId: org.id,
        },
    });

    // Update org owner
    await prisma.organization.update({
        where: { id: org.id },
        data: { ownerId: admin.id },
    });

    // Create team member entry
    await prisma.teamMember.upsert({
        where: { userId_organizationId: { userId: admin.id, organizationId: org.id } },
        update: {},
        create: {
            userId: admin.id,
            organizationId: org.id,
            role: 'admin',
        },
    });

    // Create billing subscription
    await prisma.billingSubscription.upsert({
        where: { organizationId: org.id },
        update: {},
        create: {
            organizationId: org.id,
            plan: 'pro',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });

    // Create a sample server
    const server = await prisma.server.upsert({
        where: { agentKey: 'agent_sample_key_for_development' },
        update: {},
        create: {
            name: 'Primary Server',
            hostname: 'server-01',
            ipAddress: '127.0.0.1',
            status: 'online',
            agentKey: 'agent_sample_key_for_development',
            cpuUsage: 23.5,
            ramUsage: 4.2,
            ramTotal: 16.0,
            diskUsage: 45.0,
            diskTotal: 100.0,
            containerCount: 3,
            os: 'Ubuntu 24.04',
        },
    });

    // Create a sample project
    await prisma.project.upsert({
        where: { slug_organizationId: { slug: 'sample-app', organizationId: org.id } },
        update: {},
        create: {
            name: 'Sample App',
            slug: 'sample-app',
            description: 'A sample Node.js application for demo',
            gitUrl: 'https://github.com/example/sample-app.git',
            branch: 'main',
            framework: 'nodejs',
            buildCommand: 'npm run build',
            startCommand: 'npm start',
            port: 3000,
            organizationId: org.id,
            serverId: server.id,
            status: 'running',
        },
    });

    console.log('✅ Database seeded successfully');
    console.log(`   Admin: admin@servermg.com / admin123`);
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
