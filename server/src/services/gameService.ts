import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import { GAME_CONFIG } from "../utils/constants";
import { calculateMatchScore } from "../utils/helpers";
import { deductHeart } from "./heartService";
import { addUserXp } from "./userService";

/**
 * Create a new match
 */
export const createMatch = async (mode: "SOLO" | "DUEL" | "TEAM") => {
  let maxPlayers = 1;
  if (mode === "DUEL") maxPlayers = 2;
  if (mode === "TEAM") maxPlayers = 6; // 2 teams of 3

  return await prisma.match.create({
    data: {
      mode,
      maxPlayers,
      status: "WAITING",
    },
  });
};

/**
 * Join a match
 */
export const joinMatch = async (
  userId: string,
  matchId: string,
  team?: number,
) => {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      players: true,
    },
  });

  if (!match) {
    throw new AppError("Match not found", 404);
  }

  if (match.status !== "WAITING") {
    throw new AppError("Match is not accepting players", 400);
  }

  // Check if player already joined
  const existingPlayer = match.players.find((p) => p.userId === userId);
  if (existingPlayer) {
    throw new AppError("Player already joined this match", 400);
  }

  if (match.players.length >= match.maxPlayers) {
    throw new AppError("Match is full", 400);
  }

  // Auto-assign team if not provided
  if (match.mode === "TEAM" && !team) {
    const teamCount = {
      1: match.players.filter((p: any) => p.team === 1).length,
      2: match.players.filter((p: any) => p.team === 2).length,
    };
    team =
      teamCount[1 as keyof typeof teamCount] <=
      teamCount[2 as keyof typeof teamCount]
        ? 1
        : 2;
  }

  return await prisma.matchPlayer.create({
    data: {
      userId,
      matchId,
      team,
    },
  });
};

/**
 * Start a match
 */
export const startMatch = async (matchId: string) => {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      players: true,
    },
  });

  if (!match) {
    throw new AppError("Match not found", 404);
  }

  if (match.mode === "DUEL" && match.players.length !== 2) {
    throw new AppError("DUEL requires 2 players", 400);
  }

  if (match.mode === "TEAM" && match.players.length < 2) {
    throw new AppError("TEAM mode requires at least 2 players", 400);
  }

  // Add questions to match
  const questionsPerMatch =
    match.mode === "SOLO"
      ? GAME_CONFIG.SOLO_QUESTIONS
      : match.mode === "DUEL"
        ? GAME_CONFIG.DUEL_QUESTIONS
        : GAME_CONFIG.TEAM_QUESTIONS;

  // Get random questions
  const questions = await prisma.question.findMany({
    take: questionsPerMatch,
    orderBy: { createdAt: "desc" },
  });

  for (let i = 0; i < questions.length; i++) {
    await prisma.matchQuestion.create({
      data: {
        matchId,
        questionId: questions[i].id,
        order: i + 1,
      },
    });
  }

  return await prisma.match.update({
    where: { id: matchId },
    data: {
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });
};

/**
 * Submit answer to match question
 */
export const submitMatchAnswer = async (
  userId: string,
  matchId: string,
  matchQuestionId: string,
  answerId: string,
  responseTimeMs: number,
) => {
  const matchPlayer = await prisma.matchPlayer.findUnique({
    where: {
      userId_matchId: {
        userId,
        matchId,
      },
    },
  });

  if (!matchPlayer) {
    throw new AppError("Player not found in match", 404);
  }

  const matchQuestion = await prisma.matchQuestion.findUnique({
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
    throw new AppError("Question not found in match", 404);
  }

  const answer = matchQuestion.question.answers.find(
    (a: any) => a.id === answerId,
  );

  if (!answer) {
    throw new AppError("Answer not found", 404);
  }

  const isCorrect = answer.isCorrect;

  // Create player answer record
  const playerAnswer = await prisma.playerAnswer.create({
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
  await prisma.matchPlayer.update({
    where: { id: matchPlayer.id },
    data: {
      score: matchPlayer.score + scoreIncrease,
    },
  });

  // Deduct heart if wrong
  if (!isCorrect) {
    await deductHeart(userId, "Wrong answer in match");
  }

  return playerAnswer;
};

/**
 * Finish a match and determine winner
 */
export const finishMatch = async (matchId: string) => {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      players: true,
    },
  });

  if (!match) {
    throw new AppError("Match not found", 404);
  }

  // Determine winner(s)
  if (match.mode === "TEAM") {
    // Find team with highest score
    const team1Score = match.players
      .filter((p: any) => p.team === 1)
      .reduce((sum: number, p: any) => sum + p.score, 0);
    const team2Score = match.players
      .filter((p: any) => p.team === 2)
      .reduce((sum: number, p: any) => sum + p.score, 0);

    const winningTeam = team1Score > team2Score ? 1 : 2;

    // Mark winners
    await prisma.matchPlayer.updateMany({
      where: {
        matchId,
        team: winningTeam,
      },
      data: {
        isWinner: true,
      },
    });
  } else {
    // Find player with highest score
    const winner = match.players.reduce((prev: any, curr: any) =>
      curr.score > prev.score ? curr : prev,
    );

    await prisma.matchPlayer.update({
      where: { id: winner.id },
      data: { isWinner: true },
    });
  }

  // Award XP to players
  for (const player of match.players) {
    const xpAmount = player.isWinner ? 100 : 50;
    await addUserXp(
      player.userId,
      xpAmount,
      `Match ${match.mode} ${player.isWinner ? "win" : "participation"}`,
    );
  }

  return await prisma.match.update({
    where: { id: matchId },
    data: {
      status: "FINISHED",
      endedAt: new Date(),
    },
  });
};

/**
 * Get match details
 */
export const getMatchById = async (matchId: string) => {
  return await prisma.match.findUnique({
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

/**
 * Get user's match history
 */
export const getUserMatches = async (userId: string, skip = 0, take = 20) => {
  return await prisma.matchPlayer.findMany({
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

/**
 * Cancel a match
 */
export const cancelMatch = async (matchId: string) => {
  return await prisma.match.update({
    where: { id: matchId },
    data: { status: "CANCELLED" },
  });
};
