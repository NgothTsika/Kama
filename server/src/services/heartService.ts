import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { HEART_CONSTANTS } from "../utils/constants";
import { calculateHeartRefillTime } from "../utils/helpers";

/**
 * Get user's current hearts
 */
export const getUserHearts = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hearts: true,
      maxHearts: true,
      lastHeartRefill: true,
      isPremium: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
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
    const heartsRefilled = calculateHeartRefillTime(
      user.lastHeartRefill,
      user.maxHearts,
    );
    currentHearts = Math.min(user.hearts + heartsRefilled, user.maxHearts);
  }

  return {
    hearts: currentHearts,
    maxHearts: user.maxHearts,
    isPremium: false,
  };
};

/**
 * Deduct heart for wrong answer
 */
export const deductHeart = async (userId: string, reason = "Wrong answer") => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Premium users don't lose hearts
  if (user.isPremium) {
    return {
      hearts: user.maxHearts,
      maxHearts: user.maxHearts,
    };
  }

  if (user.hearts <= 0) {
    throw new AppError("No hearts remaining", 400, "NO_HEARTS");
  }

  // Create heart log
  await prisma.heartLog.create({
    data: {
      userId,
      change: -HEART_CONSTANTS.HEART_LOSS_WRONG_ANSWER,
      reason,
    },
  });

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      hearts: Math.max(
        0,
        user.hearts - HEART_CONSTANTS.HEART_LOSS_WRONG_ANSWER,
      ),
    },
  });

  return {
    hearts: updatedUser.hearts,
    maxHearts: updatedUser.maxHearts,
  };
};

/**
 * Refill hearts
 */
export const refillHearts = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Create heart log
  await prisma.heartLog.create({
    data: {
      userId,
      change: HEART_CONSTANTS.MAX_HEARTS - user.hearts,
      reason: "Manual refill",
    },
  });

  // Update user
  const updatedUser = await prisma.user.update({
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

/**
 * Add hearts (bonus, daily reward, etc.)
 */
export const addHearts = async (
  userId: string,
  amount: number,
  reason = "Bonus",
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Create heart log
  await prisma.heartLog.create({
    data: {
      userId,
      change: amount,
      reason,
    },
  });

  // Update user
  const updatedUser = await prisma.user.update({
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

/**
 * Get heart logs for user
 */
export const getHeartLogs = async (userId: string, limit = 50) => {
  return await prisma.heartLog.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};
