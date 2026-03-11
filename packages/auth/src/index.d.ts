export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export interface TokenPayload {
    sub: string;
    email: string;
    role: string;
    orgId: string;
}
export declare function generateAccessToken(payload: TokenPayload, secret: string, expiresIn?: string): string;
export declare function generateRefreshToken(payload: TokenPayload, secret: string, expiresIn?: string): string;
export declare function verifyToken(token: string, secret: string): TokenPayload;
export declare function generateTokenPair(payload: TokenPayload, accessSecret: string, refreshSecret: string, accessExpiry?: string, refreshExpiry?: string): {
    accessToken: string;
    refreshToken: string;
};
export declare function generateApiKey(): string;
export declare function generateAgentKey(): string;
export declare function isAdmin(role: string): boolean;
export declare function isOwnerOrAdmin(role: string): boolean;
export declare function hasRole(userRole: string, requiredRoles: string[]): boolean;
//# sourceMappingURL=index.d.ts.map