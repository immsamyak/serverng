"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
exports.generateTokenPair = generateTokenPair;
exports.generateApiKey = generateApiKey;
exports.generateAgentKey = generateAgentKey;
exports.isAdmin = isAdmin;
exports.isOwnerOrAdmin = isOwnerOrAdmin;
exports.hasRole = hasRole;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 12;
// ---- Password Hashing ----
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function generateAccessToken(payload, secret, expiresIn = '15m') {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
function generateRefreshToken(payload, secret, expiresIn = '7d') {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
function verifyToken(token, secret) {
    return jsonwebtoken_1.default.verify(token, secret);
}
function generateTokenPair(payload, accessSecret, refreshSecret, accessExpiry = '15m', refreshExpiry = '7d') {
    return {
        accessToken: generateAccessToken(payload, accessSecret, accessExpiry),
        refreshToken: generateRefreshToken(payload, refreshSecret, refreshExpiry),
    };
}
// ---- API Key Generation ----
function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'smg_';
    for (let i = 0; i < 40; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}
function generateAgentKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'agent_';
    for (let i = 0; i < 48; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}
// ---- Role Checks ----
function isAdmin(role) {
    return role === 'admin';
}
function isOwnerOrAdmin(role) {
    return role === 'admin' || role === 'owner';
}
function hasRole(userRole, requiredRoles) {
    return requiredRoles.includes(userRole);
}
//# sourceMappingURL=index.js.map