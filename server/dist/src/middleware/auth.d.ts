import { Request, Response, NextFunction } from "express";
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
export declare const verifyAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * Optional authentication middleware - doesn't fail if token is invalid
 */
export declare const optionalAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map