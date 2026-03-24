"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
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
            message: process.env.NODE_ENV === "development"
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
exports.errorHandler = errorHandler;
/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: "Not found",
        path: req.path,
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Async error wrapper for route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map