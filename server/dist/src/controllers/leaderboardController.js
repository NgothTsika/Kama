"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimWeeklyRewards = exports.getUserCountryRank = exports.getUserGlobalRank = exports.getCountryLeaderboard = exports.getGlobalLeaderboard = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const leaderboardService = __importStar(require("../services/leaderboardService"));
const userService = __importStar(require("../services/userService"));
/**
 * Get global leaderboard
 */
exports.getGlobalLeaderboard = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const weekOffset = parseInt(req.query.weekOffset) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 50;
    const leaderboard = await leaderboardService.getGlobalLeaderboard(weekOffset, skip, take);
    res.json(leaderboard);
});
/**
 * Get country leaderboard
 */
exports.getCountryLeaderboard = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { countryCode } = req.params;
    const weekOffset = parseInt(req.query.weekOffset) || 0;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 50;
    const leaderboard = await leaderboardService.getCountryLeaderboard(countryCode, weekOffset, skip, take);
    res.json(leaderboard);
});
/**
 * Get user's global rank
 */
exports.getUserGlobalRank = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const weekOffset = parseInt(req.query.weekOffset) || 0;
    const rank = await leaderboardService.getUserGlobalRank(user.id, weekOffset);
    res.json(rank);
});
/**
 * Get user's country rank
 */
exports.getUserCountryRank = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { countryCode } = req.params;
    const weekOffset = parseInt(req.query.weekOffset) || 0;
    const rank = await leaderboardService.getUserCountryRank(user.id, countryCode, weekOffset);
    res.json(rank);
});
/**
 * Claim weekly rewards
 */
exports.claimWeeklyRewards = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const rewards = await leaderboardService.claimWeeklyRewards(user.id);
    res.json(rewards);
});
//# sourceMappingURL=leaderboardController.js.map