"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStreakIfNeeded = exports.claimDailyReward = exports.getDailyRewardStatus = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
const constants_1 = require("../utils/constants");
/**
 * Get user's daily reward status
 */
const getDailyRewardStatus = async (userId) => {
    let userDaily = await prisma_1.default.userDaily.findUnique({
        where: { userId },
    });
    // Create if doesn't exist
    if (!userDaily) {
        userDaily = await prisma_1.default.userDaily.create({
            data: { userId },
        });
    }
    // Check if can claim today
    const lastClaimDate = userDaily.lastClaimDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const canClaimToday = !lastClaimDate ||
        new Date(lastClaimDate).toDateString() !== today.toDateString();
    // Calculate day in streak
    let dayInStreak = 1;
    if (lastClaimDate) {
        const lastDate = new Date(lastClaimDate);
        lastDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
            // Consecutive day
            dayInStreak = userDaily.streak + 1;
        }
        else if (daysDiff > 1) {
            // Streak broken, reset
            dayInStreak = 1;
        }
        else {
            dayInStreak = userDaily.streak;
        }
    }
    const reward = constants_1.DAILY_REWARDS[(dayInStreak - 1) % constants_1.DAILY_REWARDS.length];
    return {
        canClaimToday,
        streak: dayInStreak,
        nextReward: reward,
    };
};
exports.getDailyRewardStatus = getDailyRewardStatus;
/**
 * Claim daily reward
 */
const claimDailyReward = async (userId) => {
    const status = await (0, exports.getDailyRewardStatus)(userId);
    if (!status.canClaimToday) {
        throw new errorHandler_1.AppError("Already claimed today", 400, "ALREADY_CLAIMED");
    }
    const reward = status.nextReward;
    const newStreak = status.streak;
    // Get user
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    // Update user with rewards
    const updatedUser = await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            xp: user.xp + reward.xpReward,
            coins: user.coins + reward.coinReward,
            hearts: reward.heartReward
                ? Math.min(user.hearts + reward.heartReward, user.maxHearts)
                : user.hearts,
        },
    });
    // Update daily tracking
    await prisma_1.default.userDaily.update({
        where: { userId },
        data: {
            lastClaimDate: new Date(),
            streak: newStreak,
        },
    });
    // Create logs
    await prisma_1.default.xpLog.create({
        data: {
            userId,
            amount: reward.xpReward,
            reason: `Daily reward - Day ${newStreak}`,
        },
    });
    if (reward.heartReward) {
        await prisma_1.default.heartLog.create({
            data: {
                userId,
                change: reward.heartReward,
                reason: "Daily reward",
            },
        });
    }
    return {
        reward,
        streak: newStreak,
        user: {
            xp: updatedUser.xp,
            coins: updatedUser.coins,
            hearts: updatedUser.hearts,
        },
    };
};
exports.claimDailyReward = claimDailyReward;
/**
 * Reset streak if needed (internal)
 */
const resetStreakIfNeeded = async (userId) => {
    const userDaily = await prisma_1.default.userDaily.findUnique({
        where: { userId },
    });
    if (!userDaily || !userDaily.lastClaimDate) {
        return;
    }
    const lastDate = new Date(userDaily.lastClaimDate);
    lastDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1) {
        // Streak broken
        await prisma_1.default.userDaily.update({
            where: { userId },
            data: { streak: 0 },
        });
    }
};
exports.resetStreakIfNeeded = resetStreakIfNeeded;
//# sourceMappingURL=dailyRewardService.js.map