import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { DAILY_REWARDS } from "../utils/constants";

/**
 * Get user's daily reward status
 */
export const getDailyRewardStatus = async (userId: string) => {
  let userDaily = await prisma.userDaily.findUnique({
    where: { userId },
  });

  // Create if doesn't exist
  if (!userDaily) {
    userDaily = await prisma.userDaily.create({
      data: { userId },
    });
  }

  // Check if can claim today
  const lastClaimDate = userDaily.lastClaimDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canClaimToday =
    !lastClaimDate ||
    new Date(lastClaimDate).toDateString() !== today.toDateString();

  // Calculate day in streak
  let dayInStreak = 1;
  if (lastClaimDate) {
    const lastDate = new Date(lastClaimDate);
    lastDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 1) {
      // Consecutive day
      dayInStreak = userDaily.streak + 1;
    } else if (daysDiff > 1) {
      // Streak broken, reset
      dayInStreak = 1;
    } else {
      dayInStreak = userDaily.streak;
    }
  }

  const reward = DAILY_REWARDS[(dayInStreak - 1) % DAILY_REWARDS.length];

  return {
    canClaimToday,
    streak: dayInStreak,
    nextReward: reward,
  };
};

/**
 * Claim daily reward
 */
export const claimDailyReward = async (userId: string) => {
  const status = await getDailyRewardStatus(userId);

  if (!status.canClaimToday) {
    throw new AppError("Already claimed today", 400, "ALREADY_CLAIMED");
  }

  const reward = status.nextReward;
  const newStreak = status.streak;

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Update user with rewards
  const updatedUser = await prisma.user.update({
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
  await prisma.userDaily.update({
    where: { userId },
    data: {
      lastClaimDate: new Date(),
      streak: newStreak,
    },
  });

  // Create logs
  await prisma.xpLog.create({
    data: {
      userId,
      amount: reward.xpReward,
      reason: `Daily reward - Day ${newStreak}`,
    },
  });

  if (reward.heartReward) {
    await prisma.heartLog.create({
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

/**
 * Reset streak if needed (internal)
 */
export const resetStreakIfNeeded = async (userId: string) => {
  const userDaily = await prisma.userDaily.findUnique({
    where: { userId },
  });

  if (!userDaily || !userDaily.lastClaimDate) {
    return;
  }

  const lastDate = new Date(userDaily.lastClaimDate);
  lastDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysDiff > 1) {
    // Streak broken
    await prisma.userDaily.update({
      where: { userId },
      data: { streak: 0 },
    });
  }
};
