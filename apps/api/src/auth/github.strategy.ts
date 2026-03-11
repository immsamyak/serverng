import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID || 'not-configured',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'not-configured',
            callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/api/auth/github/callback',
            scope: ['user:email', 'repo'],
        });
    }

    async validate(accessToken: string, _refreshToken: string, profile: any) {
        return this.authService.validateGithubUser(profile, accessToken);
    }
}
