import { LEVEL_THRESHOLDS, RANKS } from "./constants";

/**
 * Calculate user level based on XP
 */
export const calculateLevel = (xp: number): number => {
  let level = 1;
  for (const [lvl, requiredXp] of Object.entries(LEVEL_THRESHOLDS)) {
    if (xp >= requiredXp) {
      level = parseInt(lvl);
    } else {
      break;
    }
  }
  return level;
};

/**
 * Calculate user rank based on XP
 */
export const calculateRank = (xp: number): string => {
  if (xp >= RANKS.LEGEND) return "LEGEND";
  if (xp >= RANKS.DIAMOND) return "DIAMOND";
  if (xp >= RANKS.GOLD) return "GOLD";
  if (xp >= RANKS.SILVER) return "SILVER";
  return "BRONZE";
};

/**
 * Calculate XP needed to next level
 */
export const calculateXpToNextLevel = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const nextLevel = currentLevel + 1;
  const nextLevelXp =
    LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS] ||
    LEVEL_THRESHOLDS[10];
  return nextLevelXp - xp;
};

/**
 * Calculate hearts refill time
 */
export const calculateHeartRefillTime = (
  lastRefillTime: Date,
  maxHearts: number = 5,
): number => {
  const now = new Date();
  const timeDiff = now.getTime() - lastRefillTime.getTime();
  const hoursPassed = timeDiff / (1000 * 60 * 60);
  const heartsRefilled = Math.floor(hoursPassed);
  return Math.min(heartsRefilled, maxHearts);
};

/**
 * Generate a random code for match joining
 */
export const generateMatchCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Format date for week start (Monday)
 */
export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

/**
 * Format date for week end (Sunday)
 */
export const getWeekEnd = (date: Date = new Date()): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
};

/**
 * Calculate match score based on correct answers and response time
 */
export const calculateMatchScore = (
  correctAnswers: number,
  totalQuestions: number,
  responseTimeMs: number,
  difficulty: number = 1,
): number => {
  const baseScore = (correctAnswers / totalQuestions) * 100 * difficulty;
  const timeBonus = Math.max(0, 100 - responseTimeMs / 1000); // Max 100 bonus points for fast responses
  return Math.floor(baseScore + timeBonus);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username format
 */
export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscores only
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
