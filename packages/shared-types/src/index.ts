// ============================================
// ServerMG Shared Types
// ============================================

// ---- Enums ----

export enum UserRole {
    ADMIN = 'admin',
    OWNER = 'owner',
    MEMBER = 'member',
    VIEWER = 'viewer',
}

export enum ProjectFramework {
    NODEJS = 'nodejs',
    NEXTJS = 'nextjs',
    REACT = 'react',
    DJANGO = 'django',
    FASTAPI = 'fastapi',
    LARAVEL = 'laravel',
    DOCKER = 'docker',
    STATIC = 'static',
}

export enum DeploymentStatus {
    QUEUED = 'queued',
    BUILDING = 'building',
    DEPLOYING = 'deploying',
    RUNNING = 'running',
    FAILED = 'failed',
    STOPPED = 'stopped',
    CANCELLED = 'cancelled',
}

export enum ServerStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
    MAINTENANCE = 'maintenance',
    ERROR = 'error',
}

export enum DatabaseEngine {
    POSTGRESQL = 'postgresql',
    MYSQL = 'mysql',
    MONGODB = 'mongodb',
    REDIS = 'redis',
}

export enum SslStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    EXPIRED = 'expired',
    FAILED = 'failed',
}

export enum LogType {
    BUILD = 'build',
    DEPLOY = 'deploy',
    APP = 'app',
    SERVER = 'server',
    NGINX = 'nginx',
    ERROR = 'error',
}

export enum BillingPlan {
    FREE = 'free',
    STARTER = 'starter',
    PRO = 'pro',
    ENTERPRISE = 'enterprise',
}

export enum BillingStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    PAST_DUE = 'past_due',
    TRIALING = 'trialing',
}

// ---- Interfaces ----

export interface IUser {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    organizationId: string;
    githubId?: string;
    githubToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrganization {
    id: string;
    name: string;
    slug: string;
    plan: BillingPlan;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProject {
    id: string;
    name: string;
    slug: string;
    description?: string;
    gitUrl: string;
    branch: string;
    framework: ProjectFramework;
    buildCommand?: string;
    startCommand?: string;
    port: number;
    organizationId: string;
    serverId?: string;
    containerId?: string;
    status: DeploymentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDeployment {
    id: string;
    projectId: string;
    status: DeploymentStatus;
    commitSha?: string;
    commitMessage?: string;
    branch: string;
    buildLogs: string;
    buildDuration?: number;
    imageId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IServer {
    id: string;
    name: string;
    hostname: string;
    ipAddress: string;
    status: ServerStatus;
    agentKey: string;
    cpuUsage?: number;
    ramUsage?: number;
    diskUsage?: number;
    containerCount?: number;
    os?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDomain {
    id: string;
    name: string;
    projectId: string;
    sslStatus: SslStatus;
    sslCertificateId?: string;
    isVerified: boolean;
    verificationToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISslCertificate {
    id: string;
    domain: string;
    issuer: string;
    expiresAt: Date;
    autoRenew: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDatabase {
    id: string;
    name: string;
    engine: DatabaseEngine;
    host: string;
    port: number;
    username: string;
    password: string;
    databaseName: string;
    projectId?: string;
    organizationId: string;
    sizeBytes?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEnvironmentVariable {
    id: string;
    key: string;
    value: string;
    projectId: string;
    isSecret: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILog {
    id: string;
    type: LogType;
    message: string;
    source: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    projectId?: string;
    deploymentId?: string;
    serverId?: string;
    timestamp: Date;
}

export interface IBillingSubscription {
    id: string;
    organizationId: string;
    plan: BillingPlan;
    status: BillingStatus;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITeamMember {
    id: string;
    userId: string;
    organizationId: string;
    role: UserRole;
    invitedBy?: string;
    joinedAt: Date;
}

// ---- API Request/Response Types ----

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    organizationName?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface CreateProjectRequest {
    name: string;
    gitUrl: string;
    branch?: string;
    framework?: ProjectFramework;
    buildCommand?: string;
    startCommand?: string;
    port?: number;
    envVars?: Record<string, string>;
}

export interface CreateDatabaseRequest {
    name: string;
    engine: DatabaseEngine;
    projectId?: string;
}

export interface ServerMetrics {
    cpuUsage: number;
    ramUsage: number;
    ramTotal: number;
    diskUsage: number;
    diskTotal: number;
    uptime: number;
    containerCount: number;
    containers: ContainerInfo[];
    timestamp: Date;
}

export interface ContainerInfo {
    id: string;
    name: string;
    status: string;
    cpuPercent: number;
    memoryUsage: number;
    memoryLimit: number;
    ports: string[];
}

// ---- WebSocket Events ----

export enum WsEvent {
    LOG_STREAM = 'log:stream',
    LOG_NEW = 'log:new',
    DEPLOYMENT_STATUS = 'deployment:status',
    TERMINAL_INPUT = 'terminal:input',
    TERMINAL_OUTPUT = 'terminal:output',
    METRICS_UPDATE = 'metrics:update',
}
