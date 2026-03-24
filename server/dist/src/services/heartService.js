"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeartLogs = exports.addHearts = exports.refillHearts = exports.deductHeart = exports.getUserHearts = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
const constants_1 = require("../utils/constants");
const helpers_1 = require("../utils/helpers");
/**
 * Get user's current hearts
 */
const getUserHearts = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            hearts: true,
            maxHearts: true,
            lastHeartRefill: true,
            isPremium: true,
        },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // If premium, always full hearts
    if (user.isPremium) {
        return {
            hearts: user.maxHearts,
            maxHearts: user.maxHearts,
            isPremium: true,
        };
    }
    // Calculate refilled hearts
    let currentHearts = user.hearts;
    if (user.lastHeartRefill) {
        const heartsRefilled = (0, helpers_1.calculateHeartRefillTime)(user.lastHeartRefill, user.maxHearts);
        currentHearts = Math.min(user.hearts + heartsRefilled, user.maxHearts);
    }
    return {
        hearts: currentHearts,
        maxHearts: user.maxHearts,
        isPremium: false,
    };
};
exports.getUserHearts = getUserHearts;
/**
 * Deduct heart for wrong answer
 */
const deductHeart = async (userId, reason = "Wrong answer") => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Premium users don't lose hearts
    if (user.isPremium) {
        return {
            hearts: user.maxHearts,
            maxHearts: user.maxHearts,
        };
    }
    if (user.hearts <= 0) {
        throw new errorHandler_1.AppError("No hearts remaining", 400, "NO_HEARTS");
    }
    // Create heart log
    await prisma_1.default.heartLog.create({
        data: {
            userId,
            change: -constants_1.HEART_CONSTANTS.HEART_LOSS_WRONG_ANSWER,
            reason,
        },
    });
    // Update user
    const updatedUser = await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            hearts: Math.max(0, user.hearts - constants_1.HEART_CONSTANTS.HEART_LOSS_WRONG_ANSWER),
        },
    });
    return {
        hearts: updatedUser.hearts,
        maxHearts: updatedUser.maxHearts,
    };
};
exports.deductHeart = deductHeart;
/**
 * Refill hearts
 */
const refillHearts = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Create heart log
    await prisma_1.default.heartLog.create({
        data: {
            userId,
            change: constants_1.HEART_CONSTANTS.MAX_HEARTS - user.hearts,
            reason: "Manual refill",
        },
    });
    // Update user
    const updatedUser = await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            hearts: user.maxHearts,
            lastHeartRefill: new Date(),
        },
    });
    return {
        hearts: updatedUser.hearts,
        maxHearts: updatedUser.maxHearts,
    };
};
exports.refillHearts = refillHearts;
/**
 * Add hearts (bonus, daily reward, etc.)
 */
const addHearts = async (userId, amount, reason = "Bonus") => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Create heart log
    await prisma_1.default.heartLog.create({
        data: {
            userId,
            change: amount,
            reason,
        },
    });
    // Update user
    const updatedUser = await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            hearts: Math.min(user.hearts + amount, user.maxHearts),
        },
    });
    return {
        hearts: updatedUser.hearts,
        maxHearts: updatedUser.maxHearts,
    };
};
exports.addHearts = addHearts;
/**
 * Get heart logs for user
 */
const getHeartLogs = async (userId, limit = 50) => {
    return await prisma_1.default.heartLog.findMany({
        where: { userId },
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};
exports.getHeartLogs = getHeartLogs;
//# sourceMappingURL=heartService.js.map