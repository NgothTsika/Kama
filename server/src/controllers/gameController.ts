import { Response } from "express";
import { AuthRequest, asyncHandler } from "../middleware/errorHandler";
import * as gameService from "../services/gameService";
import * as userService from "../services/userService";
import * as heartService from "../services/heartService";

/**
 * Create a new match
 */
export const createMatch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { mode } = req.body;

    if (!["SOLO", "DUEL", "TEAM"].includes(mode)) {
      res.status(400).json({ error: "Invalid game mode" });
      return;
    }

    const match = await gameService.createMatch(mode);
    res.status(201).json(match);
  },
);

/**
 * Join a match
 */
export const joinMatch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { matchId } = req.params;
    const { team } = req.body;

    const player = await gameService.joinMatch(user.id, matchId, team);
    res.status(201).json(player);
  },
);

/**
 * Start a match
 */
export const startMatch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { matchId } = req.params;
    const match = await gameService.startMatch(matchId);
    res.json(match);
  },
);

/**
 * Submit answer to a question
 */
export const submitAnswer = asyncHandler(
  async (req: AuthRequest, res: Response) => {
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

    const answer = await gameService.submitMatchAnswer(
      user.id,
      matchId,
      matchQuestionId,
      answerId,
      responseTimeMs,
    );

    res.json(answer);
  },
);

/**
 * Finish a match
 */
export const finishMatch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { matchId } = req.params;
    const match = await gameService.finishMatch(matchId);
    res.json(match);
  },
);

/**
 * Get match details
 */
export const getMatch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { matchId } = req.params;
    const match = await gameService.getMatchById(matchId);
    res.json(match);
  },
);

/**
 * Get user's match history
 */
export const getUserMatches = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const matches = await gameService.getUserMatches(user.id, skip, take);
    res.json(matches);
  },
);

/**
 * Cancel a match
 */
export const cancelMatch = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { matchId } = req.params;
    const match = await gameService.cancelMatch(matchId);
    res.json(match);
  },
);
