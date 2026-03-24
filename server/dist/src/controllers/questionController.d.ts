import { Response } from "express";
/**
 * Get all questions
 */
export declare const getAllQuestions: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get question details
 */
export declare const getQuestion: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get questions by category
 */
export declare const getQuestionsByCategory: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get questions by lesson
 */
export declare const getQuestionsByLesson: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Verify answer
 */
export declare const verifyAnswer: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get flashcards for lesson
 */
export declare const getFlashcards: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get user's flashcard reviews
 */
export declare const getFlashcardReviews: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Update flashcard review (spaced repetition)
 */
export declare const updateFlashcardReview: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=questionController.d.ts.map