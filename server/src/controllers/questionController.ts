import { Response } from "express";
import { AuthRequest, asyncHandler } from "../middleware/errorHandler";
import * as questionService from "../services/questionService";

/**
 * Get all questions
 */
export const getAllQuestions = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const questions = await questionService.getAllQuestions(skip, take);
    res.json(questions);
  },
);

/**
 * Get question details
 */
export const getQuestion = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(questionId);
    res.json(question);
  },
);

/**
 * Get questions by category
 */
export const getQuestionsByCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { categoryId } = req.params;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const questions = await questionService.getQuestionsByCategory(
      categoryId,
      skip,
      take,
    );
    res.json(questions);
  },
);

/**
 * Get questions by lesson
 */
export const getQuestionsByLesson = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { lessonId } = req.params;
    const questions = await questionService.getQuestionsByLesson(lessonId);
    res.json(questions);
  },
);

/**
 * Verify answer
 */
export const verifyAnswer = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { questionId, answerId } = req.body;
    const result = await questionService.verifyAnswer(questionId, answerId);
    res.json(result);
  },
);

/**
 * Get flashcards for lesson
 */
export const getFlashcards = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { lessonId } = req.params;
    const flashcards = await questionService.getFlashcardsByLesson(lessonId);
    res.json(flashcards);
  },
);

/**
 * Get user's flashcard reviews
 */
export const getFlashcardReviews = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    // You'll need to get the user from the database first
    const reviews = await questionService.getUserFlashcardReviews(req.user.id);
    res.json(reviews);
  },
);

/**
 * Update flashcard review (spaced repetition)
 */
export const updateFlashcardReview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { flashcardId, quality } = req.body;
    const review = await questionService.updateFlashcardReview(
      req.user.id,
      flashcardId,
      quality,
    );
    res.json(review);
  },
);
