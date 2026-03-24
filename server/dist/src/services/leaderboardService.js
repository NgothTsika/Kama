"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimWeeklyRewards = exports.getWeeklyRewardByRank = exports.updateWeeklyLeaderboard = exports.getUserCountryRank = exports.getUserGlobalRank = exports.getCountryLeaderboard = exports.getGlobalLeaderboard = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
/**
 * Get weekly global leaderboard
 */
const getGlobalLeaderboard = async (weekOffset = 0, skip = 0, take = 50) => {
    const today = new Date();
    const weekStart = (0, helpers_1.getWeekStart)(new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = (0, helpers_1.getWeekEnd)(weekStart);
    return await prisma_1.default.leaderboardEntry.findMany({
        where: {
            weekStart,
            weekEnd,
            countryCode: null,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    rank: true,
                    level: true,
                },
            },
        },
        skip,
        take,
        orderBy: { xp: "desc" },
    });
};
exports.getGlobalLeaderboard = getGlobalLeaderboard;
/**
 * Get country leaderboard
 */
const getCountryLeaderboard = async (countryCode, weekOffset = 0, skip = 0, take = 50) => {
    const today = new Date();
    const weekStart = (0, helpers_1.getWeekStart)(new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000));
    const weekEnd = (0, helpers_1.getWeekEnd)(weekStart);
    return await prisma_1.default.leaderboardEntry.findMany({
        where: {
            weekStart,
            weekEnd,
            countryCode,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                    rank: true,
                    level: true,
                },
            },
        },
        skip,
        take,
        orderBy: { xp: "desc" },
    });
};
exports.getCountryLeaderboard = getCountryLeaderboard;
/**
 * Get user's leaderboard rank (global)
 */
const getUserGlobalRank = async (userId, weekOffset = 0) => {
    const today = new Date();
    const weekStart = (0, helpers_1.getWeekStart)(new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000));
    const entries = await prisma_1.default.leaderboardEntry.findMany({
        where: {
            weekStart,
            countryCode: null,
        },
        orderBy: { xp: "desc" },
    });
    const rank = entries.findIndex((e) => e.userId === userId) + 1;
    return {
        rank: rank === 0 ? null : rank,
        totalPlayers: entries.length,
    };
};
exports.getUserGlobalRank = getUserGlobalRank;
/**
 * Get user's leaderboard rank (country)
 */
const getUserCountryRank = async (userId, countryCode, weekOffset = 0) => {
    const today = new Date();
    const weekStart = (0, helpers_1.getWeekStart)(new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000));
    const entries = await prisma_1.default.leaderboardEntry.findMany({
        where: {
            weekStart,
            countryCode,
        },
        orderBy: { xp: "desc" },
    });
    const rank = entries.findIndex((e) => e.userId === userId) + 1;
    return {
        rank: rank === 0 ? null : rank,
        totalPlayers: entries.length,
    };
};
exports.getUserCountryRank = getUserCountryRank;
/**
 * Update leaderboard for current week (call this periodically)
 */
const updateWeeklyLeaderboard = async () => {
    const weekStart = (0, helpers_1.getWeekStart)();
    const weekEnd = (0, helpers_1.getWeekEnd)();
    // Clear old entries for this week (in case of re-run)
    await prisma_1.default.leaderboardEntry.deleteMany({
        where: {
            weekStart,
            weekEnd,
        },
    });
    // Get all users with their current XP
    const users = await prisma_1.default.user.findMany({
        select: {
            id: true,
            xp: true,
            countryCode: true,
        },
    });
    // Create global leaderboard entries
    for (const user of users) {
        await prisma_1.default.leaderboardEntry.create({
            data: {
                userId: user.id,
                xp: user.xp,
                weekStart,
                weekEnd,
            },
        });
        // Create country entries if user has country set
        if (user.countryCode) {
            await prisma_1.default.leaderboardEntry.create({
                data: {
                    userId: user.id,
                    xp: user.xp,
                    weekStart,
                    weekEnd,
                    countryCode: user.countryCode,
                },
            });
        }
    }
};
exports.updateWeeklyLeaderboard = updateWeeklyLeaderboard;
/**
 * Get weekly rewards for a rank
 */
const getWeeklyRewardByRank = async (rank) => {
    const reward = await prisma_1.default.weeklyReward.findFirst({
        where: {
            rankMin: {
                lte: rank,
            },
            rankMax: {
                gte: rank,
            },
        },
    });
    if (!reward) {
        return { xpReward: 0, coinReward: 0 };
    }
    return {
        xpReward: reward.xpReward,
        coinReward: reward.coinReward,
    };
};
exports.getWeeklyRewardByRank = getWeeklyRewardByRank;
/**
 * Claim weekly leaderboard rewards
 */
const claimWeeklyRewards = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Get global rank
    const globalRank = await (0, exports.getUserGlobalRank)(userId);
    if (!globalRank.rank) {
        throw new errorHandler_1.AppError("User not on leaderboard", 400);
    }
    const reward = await (0, exports.getWeeklyRewardByRank)(globalRank.rank);
    // Update user
    const updatedUser = await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            xp: user.xp + reward.xpReward,
            coins: user.coins + reward.coinReward,
        },
    });
    // Create XP log
    await prisma_1.default.xpLog.create({
        data: {
            userId,
            amount: reward.xpReward,
            reason: `Weekly leaderboard rank #${globalRank.rank}`,
        },
    });
    return {
        reward,
        rank: globalRank.rank,
        user: {
            xp: updatedUser.xp,
            coins: updatedUser.coins,
        },
    };
};
exports.claimWeeklyRewards = claimWeeklyRewards;
//# sourceMappingURL=leaderboardService.js.map