import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    supabaseId: string;
  };
}

/**
 * Middleware to verify JWT token from Authorization header
 */
export const verifyAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      supabaseId: user.id,
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

/**
 * Optional authentication middleware - doesn't fail if token is invalid
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(token);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        supabaseId: user.id,
      };
    }

    next();
  } catch (err) {
    // Continue without user info
    next();
  }
};
