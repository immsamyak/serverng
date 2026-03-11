import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, comparePassword, generateTokenPair, generateApiKey } from '@servermg/auth';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(data: { email: string; password: string; name: string; organizationName?: string }) {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPw = await hashPassword(data.password);

        // Create organization
        const orgSlug = (data.organizationName || data.name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const org = await this.prisma.organization.create({
            data: {
                name: data.organizationName || `${data.name}'s Organization`,
                slug: `${orgSlug}-${Date.now().toString(36)}`,
                plan: 'free',
                ownerId: 'pending',
            },
        });

        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPw,
                name: data.name,
                role: 'owner',
                organizationId: org.id,
                apiToken: generateApiKey(),
            },
        });

        await this.prisma.organization.update({
            where: { id: org.id },
            data: { ownerId: user.id },
        });

        await this.prisma.teamMember.create({
            data: { userId: user.id, organizationId: org.id, role: 'owner' },
        });

        await this.prisma.billingSubscription.create({
            data: {
                organizationId: org.id,
                plan: 'free',
                status: 'active',
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        return this.generateTokens(user);
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user);
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
            });
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) throw new UnauthorizedException();
            return this.generateTokens(user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateGithubUser(profile: any, accessToken: string) {
        let user = await this.prisma.user.findUnique({
            where: { githubId: profile.id.toString() },
        });

        if (!user) {
            const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
            user = await this.prisma.user.findUnique({ where: { email } });

            if (user) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { githubId: profile.id.toString(), githubToken: accessToken },
                });
            } else {
                const org = await this.prisma.organization.create({
                    data: {
                        name: `${profile.displayName || profile.username}'s Org`,
                        slug: `${profile.username}-${Date.now().toString(36)}`,
                        plan: 'free',
                        ownerId: 'pending',
                    },
                });

                user = await this.prisma.user.create({
                    data: {
                        email,
                        password: await hashPassword(Math.random().toString(36)),
                        name: profile.displayName || profile.username,
                        avatar: profile.photos?.[0]?.value,
                        role: 'owner',
                        organizationId: org.id,
                        githubId: profile.id.toString(),
                        githubToken: accessToken,
                        apiToken: generateApiKey(),
                    },
                });

                await this.prisma.organization.update({
                    where: { id: org.id },
                    data: { ownerId: user.id },
                });
            }
        } else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { githubToken: accessToken },
            });
        }

        return this.generateTokens(user);
    }

    private generateTokens(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            orgId: user.organizationId,
        };

        const tokens = generateTokenPair(
            payload,
            process.env.JWT_SECRET || 'dev_jwt_secret',
            process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
            process.env.JWT_EXPIRATION || '15m',
            process.env.JWT_REFRESH_EXPIRATION || '7d',
        );

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
                organizationId: user.organizationId,
            },
        };
    }
}
