"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathLessons = exports.getPathProgress = exports.updateLessonProgress = exports.getLessonProgress = exports.getLesson = exports.getLearningPath = exports.getAllLearningPaths = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const learningService = __importStar(require("../services/learningService"));
const userService = __importStar(require("../services/userService"));
/**
 * Get all learning paths
 */
exports.getAllLearningPaths = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const paths = await learningService.getAllLearningPaths(skip, take);
    res.json(paths);
});
/**
 * Get learning path details
 */
exports.getLearningPath = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pathId } = req.params;
    const path = await learningService.getLearningPathById(pathId);
    res.json(path);
});
/**
 * Get lesson details
 */
exports.getLesson = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { lessonId } = req.params;
    const lesson = await learningService.getLessonById(lessonId);
    res.json(lesson);
});
/**
 * Get user's lesson progress
 */
exports.getLessonProgress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { lessonId } = req.params;
    const progress = await learningService.getUserLessonProgress(user.id, lessonId);
    res.json(progress);
});
/**
 * Update lesson progress
 */
exports.updateLessonProgress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { lessonId } = req.params;
    const { completed, score } = req.body;
    const progress = await learningService.updateLessonProgress(user.id, lessonId, completed, score);
    // Update path progress if lesson is completed
    if (completed) {
        const lesson = await learningService.getLessonById(lessonId);
        await learningService.updatePathProgress(user.id, lesson.pathId);
        // Award XP
        if (lesson.xpReward) {
            await userService.addUserXp(user.id, lesson.xpReward, `Completed lesson: ${lesson.title}`);
        }
    }
    res.json(progress);
});
/**
 * Get user's path progress
 */
exports.getPathProgress = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { pathId } = req.params;
    const progress = await learningService.getUserPathProgress(user.id, pathId);
    res.json(progress);
});
/**
 * Get lessons in a path
 */
exports.getPathLessons = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pathId } = req.params;
    const lessons = await learningService.getLessonsByPath(pathId);
    res.json(lessons);
});
//# sourceMappingURL=learningController.js.map