"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLessonsByPath = exports.updatePathProgress = exports.updateLessonProgress = exports.getUserLessonProgress = exports.getUserPathProgress = exports.getLessonById = exports.getLearningPathById = exports.getAllLearningPaths = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get all learning paths
 */
const getAllLearningPaths = async (skip = 0, take = 20) => {
    return await prisma_1.default.learningPath.findMany({
        skip,
        take,
        include: {
            lessons: {
                select: {
                    id: true,
                    title: true,
                    order: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllLearningPaths = getAllLearningPaths;
/**
 * Get learning path by ID
 */
const getLearningPathById = async (pathId) => {
    const path = await prisma_1.default.learningPath.findUnique({
        where: { id: pathId },
        include: {
            lessons: {
                orderBy: { order: "asc" },
                include: {
                    figures: {
                        include: {
                            figure: true,
                        },
                    },
                    questions: {
                        include: {
                            question: true,
                        },
                    },
                },
            },
        },
    });
    if (!path) {
        throw new errorHandler_1.AppError("Learning path not found", 404);
    }
    return path;
};
exports.getLearningPathById = getLearningPathById;
/**
 * Get lesson by ID
 */
const getLessonById = async (lessonId) => {
    const lesson = await prisma_1.default.lesson.findUnique({
        where: { id: lessonId },
        include: {
            figures: {
                include: {
                    figure: {
                        include: {
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },
                },
            },
            questions: {
                include: {
                    question: {
                        include: {
                            answers: true,
                            categories: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },
                },
            },
            flashcards: true,
        },
    });
    if (!lesson) {
        throw new errorHandler_1.AppError("Lesson not found", 404);
    }
    return lesson;
};
exports.getLessonById = getLessonById;
/**
 * Get user's learning path progress
 */
const getUserPathProgress = async (userId, pathId) => {
    const progress = await prisma_1.default.userPathProgress.findUnique({
        where: {
            userId_pathId: {
                userId,
                pathId,
            },
        },
    });
    if (!progress) {
        throw new errorHandler_1.AppError("Progress not found", 404);
    }
    return progress;
};
exports.getUserPathProgress = getUserPathProgress;
/**
 * Get user's lesson progress
 */
const getUserLessonProgress = async (userId, lessonId) => {
    const progress = await prisma_1.default.userLessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId,
                lessonId,
            },
        },
    });
    if (!progress) {
        throw new errorHandler_1.AppError("Progress not found", 404);
    }
    return progress;
};
exports.getUserLessonProgress = getUserLessonProgress;
/**
 * Update lesson progress
 */
const updateLessonProgress = async (userId, lessonId, completed, score) => {
    let progress = await prisma_1.default.userLessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId,
                lessonId,
            },
        },
    });
    if (!progress) {
        progress = await prisma_1.default.userLessonProgress.create({
            data: {
                userId,
                lessonId,
                completed,
                score,
                completedAt: completed ? new Date() : null,
            },
        });
    }
    else {
        progress = await prisma_1.default.userLessonProgress.update({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            data: {
                completed,
                score,
                completedAt: completed ? new Date() : progress.completedAt,
            },
        });
    }
    return progress;
};
exports.updateLessonProgress = updateLessonProgress;
/**
 * Update path progress
 */
const updatePathProgress = async (userId, pathId) => {
    // Get lesson count
    const lessonCount = await prisma_1.default.lesson.count({
        where: { pathId },
    });
    if (lessonCount === 0) {
        throw new errorHandler_1.AppError("Path has no lessons", 400);
    }
    // Get completed lessons count
    const completedCount = await prisma_1.default.userLessonProgress.count({
        where: {
            userId,
            lesson: { pathId },
            completed: true,
        },
    });
    const progress = (completedCount / lessonCount) * 100;
    const completed = completedCount === lessonCount;
    let pathProgress = await prisma_1.default.userPathProgress.findUnique({
        where: {
            userId_pathId: {
                userId,
                pathId,
            },
        },
    });
    if (!pathProgress) {
        pathProgress = await prisma_1.default.userPathProgress.create({
            data: {
                userId,
                pathId,
                progress,
                completed,
            },
        });
    }
    else {
        pathProgress = await prisma_1.default.userPathProgress.update({
            where: {
                userId_pathId: {
                    userId,
                    pathId,
                },
            },
            data: {
                progress,
                completed,
            },
        });
    }
    return pathProgress;
};
exports.updatePathProgress = updatePathProgress;
/**
 * Get all lessons in a path
 */
const getLessonsByPath = async (pathId) => {
    return await prisma_1.default.lesson.findMany({
        where: { pathId },
        orderBy: { order: "asc" },
        include: {
            figures: {
                include: {
                    figure: true,
                },
            },
            questions: {
                include: {
                    question: {
                        include: {
                            answers: true,
                        },
                    },
                },
            },
        },
    });
};
exports.getLessonsByPath = getLessonsByPath;
//# sourceMappingURL=learningService.js.map