import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

/**
 * Get all questions
 */
export const getAllQuestions = async (skip = 0, take = 20) => {
  return await prisma.question.findMany({
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

/**
 * Get question by ID
 */
export const getQuestionById = async (questionId: string) => {
  const question = await prisma.question.findUnique({
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
    throw new AppError("Question not found", 404);
  }

  return question;
};

/**
 * Get questions by category
 */
export const getQuestionsByCategory = async (
  categoryId: string,
  skip = 0,
  take = 20,
) => {
  return await prisma.question.findMany({
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

/**
 * Get questions by lesson
 */
export const getQuestionsByLesson = async (lessonId: string) => {
  return await prisma.question.findMany({
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

/**
 * Get random questions for a match
 */
export const getRandomQuestions = async (
  count: number,
  difficulty?: number,
) => {
  return await prisma.question.findMany({
    take: count,
    skip: Math.floor(Math.random() * (await prisma.question.count())),
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

/**
 * Verify answer
 */
export const verifyAnswer = async (questionId: string, answerId: string) => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: {
      question: true,
    },
  });

  if (!answer) {
    throw new AppError("Answer not found", 404);
  }

  if (answer.questionId !== questionId) {
    throw new AppError("Answer does not belong to question", 400);
  }

  return {
    isCorrect: answer.isCorrect,
    correctAnswerId: (
      await prisma.answer.findFirst({
        where: {
          questionId,
          isCorrect: true,
        },
        select: { id: true },
      })
    )?.id,
  };
};

/**
 * Get flashcards for lesson
 */
export const getFlashcardsByLesson = async (lessonId: string) => {
  return await prisma.flashcard.findMany({
    where: { lessonId },
    include: {
      reviews: {
        orderBy: { nextReview: "asc" },
      },
    },
  });
};

/**
 * Get user's flashcard reviews
 */
export const getUserFlashcardReviews = async (userId: string) => {
  return await prisma.review.findMany({
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

/**
 * Update flashcard review (spaced repetition)
 */
export const updateFlashcardReview = async (
  userId: string,
  flashcardId: string,
  quality: number, // 0-5, quality of recall
) => {
  let review = await prisma.review.findFirst({
    where: {
      userId,
      flashcardId,
    },
  });

  if (!review) {
    review = await prisma.review.create({
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
  } else {
    newInterval = 1;
  }

  const nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

  return await prisma.review.update({
    where: { id: review.id },
    data: {
      interval: newInterval,
      nextReview,
    },
  });
};
