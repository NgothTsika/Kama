"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserCoins = exports.addUserXp = exports.getAllUsers = exports.getUserStats = exports.updateUser = exports.getUserBySupabaseId = exports.getUserById = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
const helpers_1 = require("../utils/helpers");
/**
 * Create a new user
 */
const createUser = async (data) => {
    if (data.username && !(0, helpers_1.isValidUsername)(data.username)) {
        throw new errorHandler_1.AppError("Invalid username format", 400);
    }
    if (data.email && !(0, helpers_1.isValidEmail)(data.email)) {
        throw new errorHandler_1.AppError("Invalid email format", 400);
    }
    // Check if user already exists
    const existingUser = await prisma_1.default.user.findUnique({
        where: { supabaseId: data.supabaseId },
    });
    if (existingUser) {
        throw new errorHandler_1.AppError("User already exists", 400);
    }
    return await prisma_1.default.user.create({
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
exports.createUser = createUser;
/**
 * Get user by ID
 */
const getUserById = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            language: true,
            country: true,
            daily: true,
        },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserById = getUserById;
/**
 * Get user by Supabase ID
 */
const getUserBySupabaseId = async (supabaseId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { supabaseId },
        include: {
            language: true,
            country: true,
            daily: true,
        },
    });
    if (!user) {
        throw new errorHandler_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserBySupabaseId = getUserBySupabaseId;
/**
 * Update user profile
 */
const updateUser = async (userId, data) => {
    if (data.username && !(0, helpers_1.isValidUsername)(data.username)) {
        throw new errorHandler_1.AppError("Invalid username format", 400);
    }
    return await prisma_1.default.user.update({
        where: { id: userId },
        data,
        include: {
            language: true,
            country: true,
            daily: true,
        },
    });
};
exports.updateUser = updateUser;
/**
 * Get user stats (XP, level, rank, etc.)
 */
const getUserStats = async (userId) => {
    const user = await (0, exports.getUserById)(userId);
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
exports.getUserStats = getUserStats;
/**
 * Get all users (paginated)
 */
const getAllUsers = async (skip = 0, take = 20) => {
    return await prisma_1.default.user.findMany({
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
exports.getAllUsers = getAllUsers;
/**
 * Update user XP and level
 */
const addUserXp = async (userId, amount, reason) => {
    const user = await (0, exports.getUserById)(userId);
    const newXp = user.xp + amount;
    const newLevel = (0, helpers_1.calculateLevel)(newXp);
    const newRank = (0, helpers_1.calculateRank)(newXp);
    // Create XP log
    await prisma_1.default.xpLog.create({
        data: {
            userId,
            amount,
            reason,
        },
    });
    // Update user
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            xp: newXp,
            level: newLevel,
            rank: newRank,
        },
    });
};
exports.addUserXp = addUserXp;
/**
 * Add coins to user
 */
const addUserCoins = async (userId, amount) => {
    const user = await (0, exports.getUserById)(userId);
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            coins: user.coins + amount,
        },
    });
};
exports.addUserCoins = addUserCoins;
//# sourceMappingURL=userService.js.map