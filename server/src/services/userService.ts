import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import {
  isValidEmail,
  isValidUsername,
  calculateLevel,
  calculateRank,
} from "../utils/helpers";

export interface CreateUserInput {
  supabaseId: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  countryCode?: string;
  languageCode?: string;
}

export interface UpdateUserInput {
  username?: string;
  avatarUrl?: string;
  countryCode?: string;
  languageCode?: string;
}

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserInput) => {
  if (data.username && !isValidUsername(data.username)) {
    throw new AppError("Invalid username format", 400);
  }

  if (data.email && !isValidEmail(data.email)) {
    throw new AppError("Invalid email format", 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { supabaseId: data.supabaseId },
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  return await prisma.user.create({
    data: {
      supabaseId: data.supabaseId,
      email: data.email,
      username: data.username,
      avatarUrl: data.avatarUrl,
      countryCode: data.countryCode,
      languageCode: data.languageCode,
      level: 1,
      rank: "BRONZE",
    },
  });
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      language: true,
      country: true,
      daily: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Get user by Supabase ID
 */
export const getUserBySupabaseId = async (supabaseId: string) => {
  const user = await prisma.user.findUnique({
    where: { supabaseId },
    include: {
      language: true,
      country: true,
      daily: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

/**
 * Update user profile
 */
export const updateUser = async (userId: string, data: UpdateUserInput) => {
  if (data.username && !isValidUsername(data.username)) {
    throw new AppError("Invalid username format", 400);
  }

  return await prisma.user.update({
    where: { id: userId },
    data,
    include: {
      language: true,
      country: true,
      daily: true,
    },
  });
};

/**
 * Get user stats (XP, level, rank, etc.)
 */
export const getUserStats = async (userId: string) => {
  const user = await getUserById(userId);

  return {
    xp: user.xp,
    level: user.level,
    rank: user.rank,
    hearts: user.hearts,
    maxHearts: user.maxHearts,
    coins: user.coins,
    isPremium: user.isPremium,
  };
};

/**
 * Get all users (paginated)
 */
export const getAllUsers = async (skip = 0, take = 20) => {
  return await prisma.user.findMany({
    skip,
    take,
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      level: true,
      xp: true,
      rank: true,
      countryCode: true,
    },
    orderBy: { xp: "desc" },
  });
};

/**
 * Update user XP and level
 */
export const addUserXp = async (
  userId: string,
  amount: number,
  reason: string,
) => {
  const user = await getUserById(userId);
  const newXp = user.xp + amount;
  const newLevel = calculateLevel(newXp);
  const newRank = calculateRank(newXp);

  // Create XP log
  await prisma.xpLog.create({
    data: {
      userId,
      amount,
      reason,
    },
  });

  // Update user
  return await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
      rank: newRank as any,
    },
  });
};

/**
 * Add coins to user
 */
export const addUserCoins = async (userId: string, amount: number) => {
  const user = await getUserById(userId);
  return await prisma.user.update({
    where: { id: userId },
    data: {
      coins: user.coins + amount,
    },
  });
};
