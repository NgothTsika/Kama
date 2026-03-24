"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.verifyAuth = void 0;
const supabase_1 = require("../config/supabase");
/**
 * Middleware to verify JWT token from Authorization header
 */
const verifyAuth = async (req, res, next) => {
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
        const { data: { user }, error, } = await supabase_1.supabaseAdmin.auth.getUser(token);
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
    }
    catch (err) {
        res.status(401).json({ error: "Authentication failed" });
    }
};
exports.verifyAuth = verifyAuth;
/**
 * Optional authentication middleware - doesn't fail if token is invalid
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const { data: { user }, } = await supabase_1.supabaseAdmin.auth.getUser(token);
        if (user) {
            req.user = {
                id: user.id,
                email: user.email,
                supabaseId: user.id,
            };
        }
        next();
    }
    catch (err) {
        // Continue without user info
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map