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
exports.cancelMatch = exports.getUserMatches = exports.getMatch = exports.finishMatch = exports.submitAnswer = exports.startMatch = exports.joinMatch = exports.createMatch = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const gameService = __importStar(require("../services/gameService"));
const userService = __importStar(require("../services/userService"));
const heartService = __importStar(require("../services/heartService"));
/**
 * Create a new match
 */
exports.createMatch = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { mode } = req.body;
    if (!["SOLO", "DUEL", "TEAM"].includes(mode)) {
        res.status(400).json({ error: "Invalid game mode" });
        return;
    }
    const match = await gameService.createMatch(mode);
    res.status(201).json(match);
});
/**
 * Join a match
 */
exports.joinMatch = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { matchId } = req.params;
    const { team } = req.body;
    const player = await gameService.joinMatch(user.id, matchId, team);
    res.status(201).json(player);
});
/**
 * Start a match
 */
exports.startMatch = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { matchId } = req.params;
    const match = await gameService.startMatch(matchId);
    res.json(match);
});
/**
 * Submit answer to a question
 */
exports.submitAnswer = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { matchId, matchQuestionId, answerId, responseTimeMs } = req.body;
    // Check hearts
    const hearts = await heartService.getUserHearts(user.id);
    if (hearts.hearts <= 0 && !hearts.isPremium) {
        res.status(400).json({ error: "No hearts remaining", code: "NO_HEARTS" });
        return;
    }
    const answer = await gameService.submitMatchAnswer(user.id, matchId, matchQuestionId, answerId, responseTimeMs);
    res.json(answer);
});
/**
 * Finish a match
 */
exports.finishMatch = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { matchId } = req.params;
    const match = await gameService.finishMatch(matchId);
    res.json(match);
});
/**
 * Get match details
 */
exports.getMatch = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { matchId } = req.params;
    const match = await gameService.getMatchById(matchId);
    res.json(match);
});
/**
 * Get user's match history
 */
exports.getUserMatches = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const matches = await gameService.getUserMatches(user.id, skip, take);
    res.json(matches);
});
/**
 * Cancel a match
 */
exports.cancelMatch = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { matchId } = req.params;
    const match = await gameService.cancelMatch(matchId);
    res.json(match);
});
//# sourceMappingURL=gameController.js.map