import { Router } from "express";
import * as userController from "../controllers/userController";
import * as learningController from "../controllers/learningController";
import * as figureController from "../controllers/figureController";
import * as questionController from "../controllers/questionController";
import * as gameController from "../controllers/gameController";
import * as leaderboardController from "../controllers/leaderboardController";
import { verifyAuth, optionalAuth } from "../middleware/auth";

const router = Router();

// ==================== USER ROUTES ====================
router.get("/users/me", verifyAuth, userController.getCurrentUser);
router.put("/users/me", verifyAuth, userController.updateProfile);
router.get("/users/stats", verifyAuth, userController.getUserStats);
router.get("/users/xp-logs", verifyAuth, userController.getXpLogs);
router.get("/users/hearts", verifyAuth, userController.getHeartStatus);
router.post("/users/hearts/refill", verifyAuth, userController.refillHearts);
router.get("/users/leaderboard-preview", userController.getAllUsers);

// ==================== LEARNING ROUTES ====================
router.get("/learning/paths", learningController.getAllLearningPaths);
router.get("/learning/paths/:pathId", learningController.getLearningPath);
router.get(
  "/learning/paths/:pathId/lessons",
  learningController.getPathLessons,
);
router.get(
  "/learning/paths/:pathId/progress",
  verifyAuth,
  learningController.getPathProgress,
);
router.put(
  "/learning/paths/:pathId/progress",
  verifyAuth,
  learningController.updateLessonProgress,
);

router.get("/learning/lessons/:lessonId", learningController.getLesson);
router.get(
  "/learning/lessons/:lessonId/progress",
  verifyAuth,
  learningController.getLessonProgress,
);
router.put(
  "/learning/lessons/:lessonId/progress",
  verifyAuth,
  learningController.updateLessonProgress,
);

// ==================== FIGURE ROUTES ====================
router.get("/figures", figureController.getAllFigures);
router.get("/figures/search", figureController.searchFigures);
router.get("/figures/:figureId", figureController.getFigure);
router.get(
  "/figures/category/:categoryId",
  figureController.getFiguresByCategory,
);

router.get("/categories", figureController.getAllCategories);
router.get("/categories/root", figureController.getRootCategories);
router.get("/categories/:categoryId", figureController.getCategory);
router.get(
  "/categories/:categoryId/children",
  figureController.getChildCategories,
);

// ==================== QUESTION ROUTES ====================
router.get("/questions", questionController.getAllQuestions);
router.get("/questions/:questionId", questionController.getQuestion);
router.get(
  "/questions/category/:categoryId",
  questionController.getQuestionsByCategory,
);
router.get(
  "/lessons/:lessonId/questions",
  questionController.getQuestionsByLesson,
);
router.post("/questions/verify", questionController.verifyAnswer);

router.get("/lessons/:lessonId/flashcards", questionController.getFlashcards);
router.get(
  "/flashcards/reviews",
  verifyAuth,
  questionController.getFlashcardReviews,
);
router.post(
  "/flashcards/reviews",
  verifyAuth,
  questionController.updateFlashcardReview,
);

// ==================== GAME ROUTES ====================
router.post("/matches", gameController.createMatch);
router.post("/matches/:matchId/join", verifyAuth, gameController.joinMatch);
router.post("/matches/:matchId/start", gameController.startMatch);
router.post(
  "/matches/:matchId/submit-answer",
  verifyAuth,
  gameController.submitAnswer,
);
router.post("/matches/:matchId/finish", gameController.finishMatch);
router.get("/matches/:matchId", gameController.getMatch);
router.get("/matches", verifyAuth, gameController.getUserMatches);
router.post("/matches/:matchId/cancel", gameController.cancelMatch);

// ==================== LEADERBOARD ROUTES ====================
router.get("/leaderboard/global", leaderboardController.getGlobalLeaderboard);
router.get(
  "/leaderboard/country/:countryCode",
  leaderboardController.getCountryLeaderboard,
);
router.get(
  "/leaderboard/me/global-rank",
  verifyAuth,
  leaderboardController.getUserGlobalRank,
);
router.get(
  "/leaderboard/me/country-rank/:countryCode",
  verifyAuth,
  leaderboardController.getUserCountryRank,
);
router.post(
  "/leaderboard/claim-rewards",
  verifyAuth,
  leaderboardController.claimWeeklyRewards,
);

export default router;
