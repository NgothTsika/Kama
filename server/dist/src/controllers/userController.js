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
exports.getAllUsers = exports.refillHearts = exports.getHeartStatus = exports.getXpLogs = exports.getUserStats = exports.updateProfile = exports.getCurrentUser = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const userService = __importStar(require("../services/userService"));
const heartService = __importStar(require("../services/heartService"));
const xpService = __importStar(require("../services/xpService"));
/**
 * Get current user profile
 */
exports.getCurrentUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    res.json(user);
});
/**
 * Update user profile
 */
exports.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const updatedUser = await userService.updateUser(user.id, req.body);
    res.json(updatedUser);
});
/**
 * Get user stats
 */
exports.getUserStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const stats = await userService.getUserStats(user.id);
    res.json(stats);
});
/**
 * Get user's XP logs
 */
exports.getXpLogs = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const logs = await xpService.getXpLogs(user.id);
    res.json(logs);
});
/**
 * Get user's heart status
 */
exports.getHeartStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const hearts = await heartService.getUserHearts(user.id);
    res.json(hearts);
});
/**
 * Refill hearts
 */
exports.refillHearts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const result = await heartService.refillHearts(user.id);
    res.json(result);
});
/**
 * Get all users (leaderboard preview)
 */
exports.getAllUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const users = await userService.getAllUsers(skip, take);
    res.json(users);
});
//# sourceMappingURL=userController.js.map