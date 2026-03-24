"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalXpInPeriod = exports.getXpLogsByReason = exports.getXpLogs = exports.getUserXp = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get total XP for user
 */
const getUserXp = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true, rank: true },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserXp = getUserXp;
/**
 * Get XP logs for user
 */
const getXpLogs = async (userId, limit = 50) => {
    return await prisma_1.default.xpLog.findMany({
        where: { userId },
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};
exports.getXpLogs = getXpLogs;
/**
 * Get XP logs by reason (for analytics)
 */
const getXpLogsByReason = async (userId, reason) => {
    return await prisma_1.default.xpLog.findMany({
        where: {
            userId,
            reason,
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getXpLogsByReason = getXpLogsByReason;
/**
 * Calculate total XP gained in period
 */
const getTotalXpInPeriod = async (userId, startDate, endDate) => {
    const logs = await prisma_1.default.xpLog.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
    });
    return logs.reduce((sum, log) => sum + log.amount, 0);
};
exports.getTotalXpInPeriod = getTotalXpInPeriod;
//# sourceMappingURL=xpService.js.map