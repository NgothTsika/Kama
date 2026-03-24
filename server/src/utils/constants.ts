/**
 * Game Constants
 */

export const HEART_CONSTANTS = {
  INITIAL_HEARTS: 5,
  MAX_HEARTS: 5,
  HEART_REFILL_TIME_HOURS: 1, // 1 hour per heart
  HEART_LOSS_WRONG_ANSWER: 1,
} as const;

export const XP_CONSTANTS = {
  LESSON_COMPLETION: 50,
  CORRECT_ANSWER: 10,
  DAILY_LOGIN: 5,
  DUEL_WIN: 100,
  TEAM_WIN: 75,
  STREAK_BONUS: 25,
} as const;

export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 5500,
  9: 8000,
  10: 12000,
} as const;

export const RANKS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 2000,
  DIAMOND: 5000,
  LEGEND: 10000,
} as const;

export const GAME_CONFIG = {
  SOLO_QUESTIONS: 10,
  DUEL_QUESTIONS: 10,
  TEAM_QUESTIONS: 15,
  TEAM_SIZE: 3,
  MATCH_TIMEOUT_MINUTES: 30,
} as const;

export const LEADERBOARD_CONFIG = {
  WEEK_START: 0, // Monday
  ENTRIES_PER_PAGE: 50,
  TOP_REWARDS_COUNT: 100,
} as const;

export const SUBSCRIPTION_COST = {
  MONTHLY_COINS: 999,
  YEARLY_COINS: 9999,
} as const;

export const DAILY_REWARDS = [
  { day: 1, xpReward: 10, coinReward: 50, heartReward: 0 },
  { day: 2, xpReward: 15, coinReward: 75, heartReward: 1 },
  { day: 3, xpReward: 20, coinReward: 100, heartReward: 0 },
  { day: 4, xpReward: 25, coinReward: 125, heartReward: 0 },
  { day: 5, xpReward: 30, coinReward: 150, heartReward: 1 },
  { day: 6, xpReward: 35, coinReward: 175, heartReward: 0 },
  { day: 7, xpReward: 50, coinReward: 250, heartReward: 2 }, // Weekly bonus
] as const;
