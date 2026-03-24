"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelMatch = exports.getUserMatches = exports.getMatchById = exports.finishMatch = exports.submitMatchAnswer = exports.startMatch = exports.joinMatch = exports.createMatch = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
const constants_1 = require("../utils/constants");
const heartService_1 = require("./heartService");
const userService_1 = require("./userService");
/**
 * Create a new match
 */
const createMatch = async (mode) => {
    let maxPlayers = 1;
    if (mode === "DUEL")
        maxPlayers = 2;
    if (mode === "TEAM")
        maxPlayers = 6; // 2 teams of 3
    return await prisma_1.default.match.create({
        data: {
            mode,
            maxPlayers,
            status: "WAITING",
        },
    });
};
exports.createMatch = createMatch;
/**
 * Join a match
 */
const joinMatch = async (userId, matchId, team) => {
    const match = await prisma_1.default.match.findUnique({
        where: { id: matchId },
        include: {
            players: true,
        },
    });
    if (!match) {
        throw new errorHandler_1.AppError("Match not found", 404);
    }
    if (match.status !== "WAITING") {
        throw new errorHandler_1.AppError("Match is not accepting players", 400);
    }
    // Check if player already joined
    const existingPlayer = match.players.find((p) => p.userId === userId);
    if (existingPlayer) {
        throw new errorHandler_1.AppError("Player already joined this match", 400);
    }
    if (match.players.length >= match.maxPlayers) {
        throw new errorHandler_1.AppError("Match is full", 400);
    }
    // Auto-assign team if not provided
    if (match.mode === "TEAM" && !team) {
        const teamCount = {
            1: match.players.filter((p) => p.team === 1).length,
            2: match.players.filter((p) => p.team === 2).length,
        };
        team =
            teamCount[1] <=
                teamCount[2]
                ? 1
                : 2;
    }
    return await prisma_1.default.matchPlayer.create({
        data: {
            userId,
            matchId,
            team,
        },
    });
};
exports.joinMatch = joinMatch;
/**
 * Start a match
 */
const startMatch = async (matchId) => {
    const match = await prisma_1.default.match.findUnique({
        where: { id: matchId },
        include: {
            players: true,
        },
    });
    if (!match) {
        throw new errorHandler_1.AppError("Match not found", 404);
    }
    if (match.mode === "DUEL" && match.players.length !== 2) {
        throw new errorHandler_1.AppError("DUEL requires 2 players", 400);
    }
    if (match.mode === "TEAM" && match.players.length < 2) {
        throw new errorHandler_1.AppError("TEAM mode requires at least 2 players", 400);
    }
    // Add questions to match
    const questionsPerMatch = match.mode === "SOLO"
        ? constants_1.GAME_CONFIG.SOLO_QUESTIONS
        : match.mode === "DUEL"
            ? constants_1.GAME_CONFIG.DUEL_QUESTIONS
            : constants_1.GAME_CONFIG.TEAM_QUESTIONS;
    // Get random questions
    const questions = await prisma_1.default.question.findMany({
        take: questionsPerMatch,
        orderBy: { createdAt: "desc" },
    });
    for (let i = 0; i < questions.length; i++) {
        await prisma_1.default.matchQuestion.create({
            data: {
                matchId,
                questionId: questions[i].id,
                order: i + 1,
            },
        });
    }
    return await prisma_1.default.match.update({
        where: { id: matchId },
        data: {
            status: "IN_PROGRESS",
            startedAt: new Date(),
        },
    });
};
exports.startMatch = startMatch;
/**
 * Submit answer to match question
 */
const submitMatchAnswer = async (userId, matchId, matchQuestionId, answerId, responseTimeMs) => {
    const matchPlayer = await prisma_1.default.matchPlayer.findUnique({
        where: {
            userId_matchId: {
                userId,
                matchId,
            },
        },
    });
    if (!matchPlayer) {
        throw new errorHandler_1.AppError("Player not found in match", 404);
    }
    const matchQuestion = await prisma_1.default.matchQuestion.findUnique({
        where: { id: matchQuestionId },
        include: {
            question: {
                include: {
                    answers: true,
                },
            },
        },
    });
    if (!matchQuestion) {
        throw new errorHandler_1.AppError("Question not found in match", 404);
    }
    const answer = matchQuestion.question.answers.find((a) => a.id === answerId);
    if (!answer) {
        throw new errorHandler_1.AppError("Answer not found", 404);
    }
    const isCorrect = answer.isCorrect;
    // Create player answer record
    const playerAnswer = await prisma_1.default.playerAnswer.create({
        data: {
            playerId: matchPlayer.id,
            matchQuestionId,
            answerId,
            isCorrect,
            responseTimeMs,
        },
    });
    // Update match player score
    const scoreIncrease = isCorrect ? 10 + Math.floor(responseTimeMs / 1000) : 0;
    await prisma_1.default.matchPlayer.update({
        where: { id: matchPlayer.id },
        data: {
            score: matchPlayer.score + scoreIncrease,
        },
    });
    // Deduct heart if wrong
    if (!isCorrect) {
        await (0, heartService_1.deductHeart)(userId, "Wrong answer in match");
    }
    return playerAnswer;
};
exports.submitMatchAnswer = submitMatchAnswer;
/**
 * Finish a match and determine winner
 */
const finishMatch = async (matchId) => {
    const match = await prisma_1.default.match.findUnique({
        where: { id: matchId },
        include: {
            players: true,
        },
    });
    if (!match) {
        throw new errorHandler_1.AppError("Match not found", 404);
    }
    // Determine winner(s)
    if (match.mode === "TEAM") {
        // Find team with highest score
        const team1Score = match.players
            .filter((p) => p.team === 1)
            .reduce((sum, p) => sum + p.score, 0);
        const team2Score = match.players
            .filter((p) => p.team === 2)
            .reduce((sum, p) => sum + p.score, 0);
        const winningTeam = team1Score > team2Score ? 1 : 2;
        // Mark winners
        await prisma_1.default.matchPlayer.updateMany({
            where: {
                matchId,
                team: winningTeam,
            },
            data: {
                isWinner: true,
            },
        });
    }
    else {
        // Find player with highest score
        const winner = match.players.reduce((prev, curr) => curr.score > prev.score ? curr : prev);
        await prisma_1.default.matchPlayer.update({
            where: { id: winner.id },
            data: { isWinner: true },
        });
    }
    // Award XP to players
    for (const player of match.players) {
        const xpAmount = player.isWinner ? 100 : 50;
        await (0, userService_1.addUserXp)(player.userId, xpAmount, `Match ${match.mode} ${player.isWinner ? "win" : "participation"}`);
    }
    return await prisma_1.default.match.update({
        where: { id: matchId },
        data: {
            status: "FINISHED",
            endedAt: new Date(),
        },
    });
};
exports.finishMatch = finishMatch;
/**
 * Get match details
 */
const getMatchById = async (matchId) => {
    return await prisma_1.default.match.findUnique({
        where: { id: matchId },
        include: {
            players: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatarUrl: true,
                        },
                    },
                    answers: {
                        include: {
                            matchQuestion: {
                                include: {
                                    question: true,
                                },
                            },
                        },
                    },
                },
            },
            questions: {
                orderBy: { order: "asc" },
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
exports.getMatchById = getMatchById;
/**
 * Get user's match history
 */
const getUserMatches = async (userId, skip = 0, take = 20) => {
    return await prisma_1.default.matchPlayer.findMany({
        where: { userId },
        skip,
        take,
        include: {
            match: {
                include: {
                    players: {
                        select: {
                            userId: true,
                            score: true,
                            isWinner: true,
                        },
                    },
                },
            },
        },
        orderBy: { joinedAt: "desc" },
    });
};
exports.getUserMatches = getUserMatches;
/**
 * Cancel a match
 */
const cancelMatch = async (matchId) => {
    return await prisma_1.default.match.update({
        where: { id: matchId },
        data: { status: "CANCELLED" },
    });
};
exports.cancelMatch = cancelMatch;
//# sourceMappingURL=gameService.js.map