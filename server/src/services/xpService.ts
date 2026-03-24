import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

/**
 * Get total XP for user
 */
export const getUserXp = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, rank: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Get XP logs for user
 */
export const getXpLogs = async (userId: string, limit = 50) => {
  return await prisma.xpLog.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get XP logs by reason (for analytics)
 */
export const getXpLogsByReason = async (userId: string, reason: string) => {
  return await prisma.xpLog.findMany({
    where: {
      userId,
      reason,
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Calculate total XP gained in period
 */
export const getTotalXpInPeriod = async (
  userId: string,
  startDate: Date,
  endDate: Date,
) => {
  const logs = await prisma.xpLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return logs.reduce((sum: number, log: any) => sum + log.amount, 0);
};
