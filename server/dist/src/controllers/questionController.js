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
exports.updateFlashcardReview = exports.getFlashcardReviews = exports.getFlashcards = exports.verifyAnswer = exports.getQuestionsByLesson = exports.getQuestionsByCategory = exports.getQuestion = exports.getAllQuestions = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const questionService = __importStar(require("../services/questionService"));
/**
 * Get all questions
 */
exports.getAllQuestions = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const questions = await questionService.getAllQuestions(skip, take);
    res.json(questions);
});
/**
 * Get question details
 */
exports.getQuestion = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(questionId);
    res.json(question);
});
/**
 * Get questions by category
 */
exports.getQuestionsByCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const questions = await questionService.getQuestionsByCategory(categoryId, skip, take);
    res.json(questions);
});
/**
 * Get questions by lesson
 */
exports.getQuestionsByLesson = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { lessonId } = req.params;
    const questions = await questionService.getQuestionsByLesson(lessonId);
    res.json(questions);
});
/**
 * Verify answer
 */
exports.verifyAnswer = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { questionId, answerId } = req.body;
    const result = await questionService.verifyAnswer(questionId, answerId);
    res.json(result);
});
/**
 * Get flashcards for lesson
 */
exports.getFlashcards = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { lessonId } = req.params;
    const flashcards = await questionService.getFlashcardsByLesson(lessonId);
    res.json(flashcards);
});
/**
 * Get user's flashcard reviews
 */
exports.getFlashcardReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    // You'll need to get the user from the database first
    const reviews = await questionService.getUserFlashcardReviews(req.user.id);
    res.json(reviews);
});
/**
 * Update flashcard review (spaced repetition)
 */
exports.updateFlashcardReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    const { flashcardId, quality } = req.body;
    const review = await questionService.updateFlashcardReview(req.user.id, flashcardId, quality);
    res.json(review);
});
//# sourceMappingURL=questionController.js.map