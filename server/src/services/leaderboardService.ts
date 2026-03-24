import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { getWeekStart, getWeekEnd } from "../utils/helpers";

/**
 * Get weekly global leaderboard
 */
export const getGlobalLeaderboard = async (
  weekOffset = 0,
  skip = 0,
  take = 50,
) => {
  const today = new Date();
  const weekStart = getWeekStart(
    new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000),
  );
  const weekEnd = getWeekEnd(weekStart);

  return await prisma.leaderboardEntry.findMany({
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

/**
 * Get country leaderboard
 */
export const getCountryLeaderboard = async (
  countryCode: string,
  weekOffset = 0,
  skip = 0,
  take = 50,
) => {
  const today = new Date();
  const weekStart = getWeekStart(
    new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000),
  );
  const weekEnd = getWeekEnd(weekStart);

  return await prisma.leaderboardEntry.findMany({
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

/**
 * Get user's leaderboard rank (global)
 */
export const getUserGlobalRank = async (userId: string, weekOffset = 0) => {
  const today = new Date();
  const weekStart = getWeekStart(
    new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000),
  );

  const entries = await prisma.leaderboardEntry.findMany({
    where: {
      weekStart,
      countryCode: null,
    },
    orderBy: { xp: "desc" },
  });

  const rank = entries.findIndex((e: any) => e.userId === userId) + 1;

  return {
    rank: rank === 0 ? null : rank,
    totalPlayers: entries.length,
  };
};

/**
 * Get user's leaderboard rank (country)
 */
export const getUserCountryRank = async (
  userId: string,
  countryCode: string,
  weekOffset = 0,
) => {
  const today = new Date();
  const weekStart = getWeekStart(
    new Date(today.getTime() - weekOffset * 7 * 24 * 60 * 60 * 1000),
  );

  const entries = await prisma.leaderboardEntry.findMany({
    where: {
      weekStart,
      countryCode,
    },
    orderBy: { xp: "desc" },
  });

  const rank = entries.findIndex((e: any) => e.userId === userId) + 1;

  return {
    rank: rank === 0 ? null : rank,
    totalPlayers: entries.length,
  };
};

/**
 * Update leaderboard for current week (call this periodically)
 */
export const updateWeeklyLeaderboard = async () => {
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();

  // Clear old entries for this week (in case of re-run)
  await prisma.leaderboardEntry.deleteMany({
    where: {
      weekStart,
      weekEnd,
    },
  });

  // Get all users with their current XP
  const users = await prisma.user.findMany({
    select: {
      id: true,
      xp: true,
      countryCode: true,
    },
  });

  // Create global leaderboard entries
  for (const user of users) {
    await prisma.leaderboardEntry.create({
      data: {
        userId: user.id,
        xp: user.xp,
        weekStart,
        weekEnd,
      },
    });

    // Create country entries if user has country set
    if (user.countryCode) {
      await prisma.leaderboardEntry.create({
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

/**
 * Get weekly rewards for a rank
 */
export const getWeeklyRewardByRank = async (rank: number) => {
  const reward = await prisma.weeklyReward.findFirst({
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

/**
 * Claim weekly leaderboard rewards
 */
export const claimWeeklyRewards = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Get global rank
  const globalRank = await getUserGlobalRank(userId);

  if (!globalRank.rank) {
    throw new AppError("User not on leaderboard", 400);
  }

  const reward = await getWeeklyRewardByRank(globalRank.rank);

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: user.xp + reward.xpReward,
      coins: user.coins + reward.coinReward,
    },
  });

  // Create XP log
  await prisma.xpLog.create({
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
