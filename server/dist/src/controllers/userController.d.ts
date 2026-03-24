import { Response } from "express";
/**
 * Get current user profile
 */
export declare const getCurrentUser: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Update user profile
 */
export declare const updateProfile: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user stats
 */
export declare const getUserStats: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user's XP logs
 */
export declare const getXpLogs: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user's heart status
 */
export declare const getHeartStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Refill hearts
 */
export declare const refillHearts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get all users (leaderboard preview)
 */
export declare const getAllUsers: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=userController.d.ts.map