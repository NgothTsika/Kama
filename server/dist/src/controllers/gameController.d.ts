import { Response } from "express";
/**
 * Create a new match
 */
export declare const createMatch: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Join a match
 */
export declare const joinMatch: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Start a match
 */
export declare const startMatch: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Submit answer to a question
 */
export declare const submitAnswer: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Finish a match
 */
export declare const finishMatch: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get match details
 */
export declare const getMatch: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user's match history
 */
export declare const getUserMatches: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Cancel a match
 */
export declare const cancelMatch: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=gameController.d.ts.map