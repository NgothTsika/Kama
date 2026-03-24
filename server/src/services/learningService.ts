import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

/**
 * Get all learning paths
 */
export const getAllLearningPaths = async (skip = 0, take = 20) => {
  return await prisma.learningPath.findMany({
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

/**
 * Get learning path by ID
 */
export const getLearningPathById = async (pathId: string) => {
  const path = await prisma.learningPath.findUnique({
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
    throw new AppError("Learning path not found", 404);
  }

  return path;
};

/**
 * Get lesson by ID
 */
export const getLessonById = async (lessonId: string) => {
  const lesson = await prisma.lesson.findUnique({
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
    throw new AppError("Lesson not found", 404);
  }

  return lesson;
};

/**
 * Get user's learning path progress
 */
export const getUserPathProgress = async (userId: string, pathId: string) => {
  const progress = await prisma.userPathProgress.findUnique({
    where: {
      userId_pathId: {
        userId,
        pathId,
      },
    },
  });

  if (!progress) {
    throw new AppError("Progress not found", 404);
  }

  return progress;
};

/**
 * Get user's lesson progress
 */
export const getUserLessonProgress = async (
  userId: string,
  lessonId: string,
) => {
  const progress = await prisma.userLessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  if (!progress) {
    throw new AppError("Progress not found", 404);
  }

  return progress;
};

/**
 * Update lesson progress
 */
export const updateLessonProgress = async (
  userId: string,
  lessonId: string,
  completed: boolean,
  score?: number,
) => {
  let progress = await prisma.userLessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
  });

  if (!progress) {
    progress = await prisma.userLessonProgress.create({
      data: {
        userId,
        lessonId,
        completed,
        score,
        completedAt: completed ? new Date() : null,
      },
    });
  } else {
    progress = await prisma.userLessonProgress.update({
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

/**
 * Update path progress
 */
export const updatePathProgress = async (userId: string, pathId: string) => {
  // Get lesson count
  const lessonCount = await prisma.lesson.count({
    where: { pathId },
  });

  if (lessonCount === 0) {
    throw new AppError("Path has no lessons", 400);
  }

  // Get completed lessons count
  const completedCount = await prisma.userLessonProgress.count({
    where: {
      userId,
      lesson: { pathId },
      completed: true,
    },
  });

  const progress = (completedCount / lessonCount) * 100;
  const completed = completedCount === lessonCount;

  let pathProgress = await prisma.userPathProgress.findUnique({
    where: {
      userId_pathId: {
        userId,
        pathId,
      },
    },
  });

  if (!pathProgress) {
    pathProgress = await prisma.userPathProgress.create({
      data: {
        userId,
        pathId,
        progress,
        completed,
      },
    });
  } else {
    pathProgress = await prisma.userPathProgress.update({
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

/**
 * Get all lessons in a path
 */
export const getLessonsByPath = async (pathId: string) => {
  return await prisma.lesson.findMany({
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
