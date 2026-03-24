import { Response } from "express";
import { AuthRequest, asyncHandler } from "../middleware/errorHandler";
import * as leaderboardService from "../services/leaderboardService";
import * as userService from "../services/userService";

/**
 * Get global leaderboard
 */
export const getGlobalLeaderboard = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const weekOffset = parseInt(req.query.weekOffset as string) || 0;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;

    const leaderboard = await leaderboardService.getGlobalLeaderboard(
      weekOffset,
      skip,
      take,
    );
    res.json(leaderboard);
  },
);

/**
 * Get country leaderboard
 */
export const getCountryLeaderboard = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { countryCode } = req.params;
    const weekOffset = parseInt(req.query.weekOffset as string) || 0;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;

    const leaderboard = await leaderboardService.getCountryLeaderboard(
      countryCode,
      weekOffset,
      skip,
      take,
    );
    res.json(leaderboard);
  },
);

/**
 * Get user's global rank
 */
export const getUserGlobalRank = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const weekOffset = parseInt(req.query.weekOffset as string) || 0;

    const rank = await leaderboardService.getUserGlobalRank(
      user.id,
      weekOffset,
    );
    res.json(rank);
  },
);

/**
 * Get user's country rank
 */
export const getUserCountryRank = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { countryCode } = req.params;
    const weekOffset = parseInt(req.query.weekOffset as string) || 0;

    const rank = await leaderboardService.getUserCountryRank(
      user.id,
      countryCode,
      weekOffset,
    );
    res.json(rank);
  },
);

/**
 * Claim weekly rewards
 */
export const claimWeeklyRewards = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const rewards = await leaderboardService.claimWeeklyRewards(user.id);
    res.json(rewards);
  },
);
