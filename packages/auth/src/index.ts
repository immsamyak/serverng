import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

// ---- Password Hashing ----

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ---- JWT Token Management ----

export interface TokenPayload {
    sub: string;
    email: string;
    role: string;
    orgId: string;
}

export function generateAccessToken(
    payload: TokenPayload,
    secret: string,
    expiresIn: string = '15m'
): string {
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function generateRefreshToken(
    payload: TokenPayload,
    secret: string,
    expiresIn: string = '7d'
): string {
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string, secret: string): TokenPayload {
    return jwt.verify(token, secret) as TokenPayload;
}

export function generateTokenPair(
    payload: TokenPayload,
    accessSecret: string,
    refreshSecret: string,
    accessExpiry: string = '15m',
    refreshExpiry: string = '7d'
) {
    return {
        accessToken: generateAccessToken(payload, accessSecret, accessExpiry),
        refreshToken: generateRefreshToken(payload, refreshSecret, refreshExpiry),
    };
}

// ---- API Key Generation ----

export function generateApiKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'smg_';
    for (let i = 0; i < 40; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

export function generateAgentKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'agent_';
    for (let i = 0; i < 48; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// ---- Role Checks ----

export function isAdmin(role: string): boolean {
    return role === 'admin';
}

export function isOwnerOrAdmin(role: string): boolean {
    return role === 'admin' || role === 'owner';
}

export function hasRole(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
}
