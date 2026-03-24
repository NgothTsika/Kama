import { Response } from "express";
import { AuthRequest, asyncHandler } from "../middleware/errorHandler";
import * as userService from "../services/userService";
import * as heartService from "../services/heartService";
import * as xpService from "../services/xpService";

/**
 * Get current user profile
 */
export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    res.json(user);
  },
);

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const updatedUser = await userService.updateUser(user.id, req.body);
    res.json(updatedUser);
  },
);

/**
 * Get user stats
 */
export const getUserStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const stats = await userService.getUserStats(user.id);
    res.json(stats);
  },
);

/**
 * Get user's XP logs
 */
export const getXpLogs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const logs = await xpService.getXpLogs(user.id);
    res.json(logs);
  },
);

/**
 * Get user's heart status
 */
export const getHeartStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const hearts = await heartService.getUserHearts(user.id);
    res.json(hearts);
  },
);

/**
 * Refill hearts
 */
export const refillHearts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const result = await heartService.refillHearts(user.id);
    res.json(result);
  },
);

/**
 * Get all users (leaderboard preview)
 */
export const getAllUsers = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const users = await userService.getAllUsers(skip, take);
    res.json(users);
  },
);
