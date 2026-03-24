"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUsername = exports.isValidEmail = exports.calculateMatchScore = exports.getWeekEnd = exports.getWeekStart = exports.generateMatchCode = exports.calculateHeartRefillTime = exports.calculateXpToNextLevel = exports.calculateRank = exports.calculateLevel = void 0;
const constants_1 = require("./constants");
/**
 * Calculate user level based on XP
 */
const calculateLevel = (xp) => {
    let level = 1;
    for (const [lvl, requiredXp] of Object.entries(constants_1.LEVEL_THRESHOLDS)) {
        if (xp >= requiredXp) {
            level = parseInt(lvl);
        }
        else {
            break;
        }
    }
    return level;
};
exports.calculateLevel = calculateLevel;
/**
 * Calculate user rank based on XP
 */
const calculateRank = (xp) => {
    if (xp >= constants_1.RANKS.LEGEND)
        return "LEGEND";
    if (xp >= constants_1.RANKS.DIAMOND)
        return "DIAMOND";
    if (xp >= constants_1.RANKS.GOLD)
        return "GOLD";
    if (xp >= constants_1.RANKS.SILVER)
        return "SILVER";
    return "BRONZE";
};
exports.calculateRank = calculateRank;
/**
 * Calculate XP needed to next level
 */
const calculateXpToNextLevel = (xp) => {
    const currentLevel = (0, exports.calculateLevel)(xp);
    const nextLevel = currentLevel + 1;
    const nextLevelXp = constants_1.LEVEL_THRESHOLDS[nextLevel] ||
        constants_1.LEVEL_THRESHOLDS[10];
    return nextLevelXp - xp;
};
exports.calculateXpToNextLevel = calculateXpToNextLevel;
/**
 * Calculate hearts refill time
 */
const calculateHeartRefillTime = (lastRefillTime, maxHearts = 5) => {
    const now = new Date();
    const timeDiff = now.getTime() - lastRefillTime.getTime();
    const hoursPassed = timeDiff / (1000 * 60 * 60);
    const heartsRefilled = Math.floor(hoursPassed);
    return Math.min(heartsRefilled, maxHearts);
};
exports.calculateHeartRefillTime = calculateHeartRefillTime;
/**
 * Generate a random code for match joining
 */
const generateMatchCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
exports.generateMatchCode = generateMatchCode;
/**
 * Format date for week start (Monday)
 */
const getWeekStart = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
};
exports.getWeekStart = getWeekStart;
/**
 * Format date for week end (Sunday)
 */
const getWeekEnd = (date = new Date()) => {
    const weekStart = (0, exports.getWeekStart)(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
};
exports.getWeekEnd = getWeekEnd;
/**
 * Calculate match score based on correct answers and response time
 */
const calculateMatchScore = (correctAnswers, totalQuestions, responseTimeMs, difficulty = 1) => {
    const baseScore = (correctAnswers / totalQuestions) * 100 * difficulty;
    const timeBonus = Math.max(0, 100 - responseTimeMs / 1000); // Max 100 bonus points for fast responses
    return Math.floor(baseScore + timeBonus);
};
exports.calculateMatchScore = calculateMatchScore;
/**
 * Validate email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Validate username format
 */
const isValidUsername = (username) => {
    // 3-20 characters, alphanumeric and underscores only
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};
exports.isValidUsername = isValidUsername;
//# sourceMappingURL=helpers.js.map