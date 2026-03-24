"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFlashcardReview = exports.getUserFlashcardReviews = exports.getFlashcardsByLesson = exports.verifyAnswer = exports.getRandomQuestions = exports.getQuestionsByLesson = exports.getQuestionsByCategory = exports.getQuestionById = exports.getAllQuestions = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get all questions
 */
const getAllQuestions = async (skip = 0, take = 20) => {
    return await prisma_1.default.question.findMany({
        skip,
        take,
        include: {
            answers: true,
            categories: {
                include: {
                    category: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllQuestions = getAllQuestions;
/**
 * Get question by ID
 */
const getQuestionById = async (questionId) => {
    const question = await prisma_1.default.question.findUnique({
        where: { id: questionId },
        include: {
            answers: true,
            categories: {
                include: {
                    category: true,
                },
            },
            lessons: {
                include: {
                    lesson: true,
                },
            },
        },
    });
    if (!question) {
        throw new errorHandler_1.AppError("Question not found", 404);
    }
    return question;
};
exports.getQuestionById = getQuestionById;
/**
 * Get questions by category
 */
const getQuestionsByCategory = async (categoryId, skip = 0, take = 20) => {
    return await prisma_1.default.question.findMany({
        skip,
        take,
        where: {
            categories: {
                some: {
                    categoryId,
                },
            },
        },
        include: {
            answers: true,
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
};
exports.getQuestionsByCategory = getQuestionsByCategory;
/**
 * Get questions by lesson
 */
const getQuestionsByLesson = async (lessonId) => {
    return await prisma_1.default.question.findMany({
        where: {
            lessons: {
                some: {
                    lessonId,
                },
            },
        },
        include: {
            answers: true,
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
};
exports.getQuestionsByLesson = getQuestionsByLesson;
/**
 * Get random questions for a match
 */
const getRandomQuestions = async (count, difficulty) => {
    return await prisma_1.default.question.findMany({
        take: count,
        skip: Math.floor(Math.random() * (await prisma_1.default.question.count())),
        where: difficulty ? { difficulty } : undefined,
        include: {
            answers: true,
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
};
exports.getRandomQuestions = getRandomQuestions;
/**
 * Verify answer
 */
const verifyAnswer = async (questionId, answerId) => {
    const answer = await prisma_1.default.answer.findUnique({
        where: { id: answerId },
        include: {
            question: true,
        },
    });
    if (!answer) {
        throw new errorHandler_1.AppError("Answer not found", 404);
    }
    if (answer.questionId !== questionId) {
        throw new errorHandler_1.AppError("Answer does not belong to question", 400);
    }
    return {
        isCorrect: answer.isCorrect,
        correctAnswerId: (await prisma_1.default.answer.findFirst({
            where: {
                questionId,
                isCorrect: true,
            },
            select: { id: true },
        }))?.id,
    };
};
exports.verifyAnswer = verifyAnswer;
/**
 * Get flashcards for lesson
 */
const getFlashcardsByLesson = async (lessonId) => {
    return await prisma_1.default.flashcard.findMany({
        where: { lessonId },
        include: {
            reviews: {
                orderBy: { nextReview: "asc" },
            },
        },
    });
};
exports.getFlashcardsByLesson = getFlashcardsByLesson;
/**
 * Get user's flashcard reviews
 */
const getUserFlashcardReviews = async (userId) => {
    return await prisma_1.default.review.findMany({
        where: { userId },
        include: {
            flashcard: {
                include: {
                    lesson: true,
                },
            },
        },
        orderBy: { nextReview: "asc" },
    });
};
exports.getUserFlashcardReviews = getUserFlashcardReviews;
/**
 * Update flashcard review (spaced repetition)
 */
const updateFlashcardReview = async (userId, flashcardId, quality) => {
    let review = await prisma_1.default.review.findFirst({
        where: {
            userId,
            flashcardId,
        },
    });
    if (!review) {
        review = await prisma_1.default.review.create({
            data: {
                userId,
                flashcardId,
                interval: 1,
                nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            },
        });
    }
    // Simple SM-2 spaced repetition algorithm
    let newInterval = review.interval;
    if (quality >= 3) {
        newInterval = review.interval === 1 ? 3 : Math.ceil(review.interval * 1.3);
    }
    else {
        newInterval = 1;
    }
    const nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);
    return await prisma_1.default.review.update({
        where: { id: review.id },
        data: {
            interval: newInterval,
            nextReview,
        },
    });
};
exports.updateFlashcardReview = updateFlashcardReview;
//# sourceMappingURL=questionService.js.map