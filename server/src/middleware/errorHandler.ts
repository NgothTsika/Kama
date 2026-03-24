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

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      statusCode: err.statusCode,
    });
    return;
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const statusCode = 400;
    res.status(statusCode).json({
      error: "Database error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "An error occurred",
    });
    return;
  }

  // Generic error handling
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: "Not found",
    path: req.path,
  });
};

/**
 * Async error wrapper for route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
