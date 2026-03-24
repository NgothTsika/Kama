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
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
const learningController = __importStar(require("../controllers/learningController"));
const figureController = __importStar(require("../controllers/figureController"));
const questionController = __importStar(require("../controllers/questionController"));
const gameController = __importStar(require("../controllers/gameController"));
const leaderboardController = __importStar(require("../controllers/leaderboardController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// ==================== USER ROUTES ====================
router.get("/users/me", auth_1.verifyAuth, userController.getCurrentUser);
router.put("/users/me", auth_1.verifyAuth, userController.updateProfile);
router.get("/users/stats", auth_1.verifyAuth, userController.getUserStats);
router.get("/users/xp-logs", auth_1.verifyAuth, userController.getXpLogs);
router.get("/users/hearts", auth_1.verifyAuth, userController.getHeartStatus);
router.post("/users/hearts/refill", auth_1.verifyAuth, userController.refillHearts);
router.get("/users/leaderboard-preview", userController.getAllUsers);
// ==================== LEARNING ROUTES ====================
router.get("/learning/paths", learningController.getAllLearningPaths);
router.get("/learning/paths/:pathId", learningController.getLearningPath);
router.get("/learning/paths/:pathId/lessons", learningController.getPathLessons);
router.get("/learning/paths/:pathId/progress", auth_1.verifyAuth, learningController.getPathProgress);
router.put("/learning/paths/:pathId/progress", auth_1.verifyAuth, learningController.updateLessonProgress);
router.get("/learning/lessons/:lessonId", learningController.getLesson);
router.get("/learning/lessons/:lessonId/progress", auth_1.verifyAuth, learningController.getLessonProgress);
router.put("/learning/lessons/:lessonId/progress", auth_1.verifyAuth, learningController.updateLessonProgress);
// ==================== FIGURE ROUTES ====================
router.get("/figures", figureController.getAllFigures);
router.get("/figures/search", figureController.searchFigures);
router.get("/figures/:figureId", figureController.getFigure);
router.get("/figures/category/:categoryId", figureController.getFiguresByCategory);
router.get("/categories", figureController.getAllCategories);
router.get("/categories/root", figureController.getRootCategories);
router.get("/categories/:categoryId", figureController.getCategory);
router.get("/categories/:categoryId/children", figureController.getChildCategories);
// ==================== QUESTION ROUTES ====================
router.get("/questions", questionController.getAllQuestions);
router.get("/questions/:questionId", questionController.getQuestion);
router.get("/questions/category/:categoryId", questionController.getQuestionsByCategory);
router.get("/lessons/:lessonId/questions", questionController.getQuestionsByLesson);
router.post("/questions/verify", questionController.verifyAnswer);
router.get("/lessons/:lessonId/flashcards", questionController.getFlashcards);
router.get("/flashcards/reviews", auth_1.verifyAuth, questionController.getFlashcardReviews);
router.post("/flashcards/reviews", auth_1.verifyAuth, questionController.updateFlashcardReview);
// ==================== GAME ROUTES ====================
router.post("/matches", gameController.createMatch);
router.post("/matches/:matchId/join", auth_1.verifyAuth, gameController.joinMatch);
router.post("/matches/:matchId/start", gameController.startMatch);
router.post("/matches/:matchId/submit-answer", auth_1.verifyAuth, gameController.submitAnswer);
router.post("/matches/:matchId/finish", gameController.finishMatch);
router.get("/matches/:matchId", gameController.getMatch);
router.get("/matches", auth_1.verifyAuth, gameController.getUserMatches);
router.post("/matches/:matchId/cancel", gameController.cancelMatch);
// ==================== LEADERBOARD ROUTES ====================
router.get("/leaderboard/global", leaderboardController.getGlobalLeaderboard);
router.get("/leaderboard/country/:countryCode", leaderboardController.getCountryLeaderboard);
router.get("/leaderboard/me/global-rank", auth_1.verifyAuth, leaderboardController.getUserGlobalRank);
router.get("/leaderboard/me/country-rank/:countryCode", auth_1.verifyAuth, leaderboardController.getUserCountryRank);
router.post("/leaderboard/claim-rewards", auth_1.verifyAuth, leaderboardController.claimWeeklyRewards);
exports.default = router;
//# sourceMappingURL=index.js.map