import { Response } from "express";
import { AuthRequest, asyncHandler } from "../middleware/errorHandler";
import * as learningService from "../services/learningService";
import * as userService from "../services/userService";

/**
 * Get all learning paths
 */
export const getAllLearningPaths = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const paths = await learningService.getAllLearningPaths(skip, take);
    res.json(paths);
  },
);

/**
 * Get learning path details
 */
export const getLearningPath = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { pathId } = req.params;
    const path = await learningService.getLearningPathById(pathId);
    res.json(path);
  },
);

/**
 * Get lesson details
 */
export const getLesson = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { lessonId } = req.params;
    const lesson = await learningService.getLessonById(lessonId);
    res.json(lesson);
  },
);

/**
 * Get user's lesson progress
 */
export const getLessonProgress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { lessonId } = req.params;

    const progress = await learningService.getUserLessonProgress(
      user.id,
      lessonId,
    );
    res.json(progress);
  },
);

/**
 * Update lesson progress
 */
export const updateLessonProgress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { lessonId } = req.params;
    const { completed, score } = req.body;

    const progress = await learningService.updateLessonProgress(
      user.id,
      lessonId,
      completed,
      score,
    );

    // Update path progress if lesson is completed
    if (completed) {
      const lesson = await learningService.getLessonById(lessonId);
      await learningService.updatePathProgress(user.id, lesson.pathId);

      // Award XP
      if (lesson.xpReward) {
        await userService.addUserXp(
          user.id,
          lesson.xpReward,
          `Completed lesson: ${lesson.title}`,
        );
      }
    }

    res.json(progress);
  },
);

/**
 * Get user's path progress
 */
export const getPathProgress = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await userService.getUserBySupabaseId(req.user.supabaseId);
    const { pathId } = req.params;

    const progress = await learningService.getUserPathProgress(user.id, pathId);
    res.json(progress);
  },
);

/**
 * Get lessons in a path
 */
export const getPathLessons = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { pathId } = req.params;
    const lessons = await learningService.getLessonsByPath(pathId);
    res.json(lessons);
  },
);
