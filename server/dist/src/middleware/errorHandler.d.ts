import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        supabaseId: string;
    };
    body: any;
    params: any;
    query: any;
}
export declare class AppError extends Error {
    message: string;
    statusCode: number;
    code?: string | undefined;
    constructor(message: string, statusCode?: number, code?: string | undefined);
}
/**
 * Global error handling middleware
 */
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
/**
 * 404 Not Found handler
 */
export declare const notFoundHandler: (req: Request, res: Response) => void;
/**
 * Async error wrapper for route handlers
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map