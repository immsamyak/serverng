import { Controller, Post, Get, Body, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './auth.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto) {
        const result = await this.authService.register(dto);
        return { success: true, data: result };
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto.email, dto.password);
        return { success: true, data: result };
    }

    @Post('refresh')
    @HttpCode(200)
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Body() dto: RefreshTokenDto) {
        const result = await this.authService.refreshToken(dto.refreshToken);
        return { success: true, data: result };
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'Initiate GitHub OAuth' })
    async githubAuth() {
        // Guard redirects to GitHub
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'GitHub OAuth callback' })
    async githubCallback(@Req() req: any, @Res() res: Response) {
        const tokens = req.user;
        // Redirect to dashboard with tokens
        const redirectUrl = `${process.env.DASHBOARD_URL || 'http://localhost:3000'}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
        res.redirect(redirectUrl);
    }
}
