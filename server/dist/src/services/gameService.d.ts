/**
 * Create a new match
 */
export declare const createMatch: (mode: "SOLO" | "DUEL" | "TEAM") => Promise<{
    id: string;
    createdAt: Date;
    mode: import("@prisma/client").$Enums.GameMode;
    status: import("@prisma/client").$Enums.MatchStatus;
    maxPlayers: number;
    startedAt: Date | null;
    endedAt: Date | null;
}>;
/**
 * Join a match
 */
export declare const joinMatch: (userId: string, matchId: string, team?: number) => Promise<{
    id: string;
    userId: string;
    score: number;
    team: number | null;
    isWinner: boolean | null;
    joinedAt: Date;
    matchId: string;
}>;
/**
 * Start a match
 */
export declare const startMatch: (matchId: string) => Promise<{
    id: string;
    createdAt: Date;
    mode: import("@prisma/client").$Enums.GameMode;
    status: import("@prisma/client").$Enums.MatchStatus;
    maxPlayers: number;
    startedAt: Date | null;
    endedAt: Date | null;
}>;
/**
 * Submit answer to match question
 */
export declare const submitMatchAnswer: (userId: string, matchId: string, matchQuestionId: string, answerId: string, responseTimeMs: number) => Promise<{
    id: string;
    createdAt: Date;
    isCorrect: boolean;
    answerId: string;
    responseTimeMs: number;
    playerId: string;
    matchQuestionId: string;
}>;
/**
 * Finish a match and determine winner
 */
export declare const finishMatch: (matchId: string) => Promise<{
    id: string;
    createdAt: Date;
    mode: import("@prisma/client").$Enums.GameMode;
    status: import("@prisma/client").$Enums.MatchStatus;
    maxPlayers: number;
    startedAt: Date | null;
    endedAt: Date | null;
}>;
/**
 * Get match details
 */
export declare const getMatchById: (matchId: string) => Promise<({
    questions: ({
        question: {
            answers: {
                id: string;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            imageUrl: string | null;
            difficulty: number;
            text: string;
            explanation: string | null;
        };
    } & {
        id: string;
        order: number;
        questionId: string;
        startedAt: Date | null;
        endedAt: Date | null;
        matchId: string;
    })[];
    players: ({
        user: {
            id: string;
            username: string | null;
            avatarUrl: string | null;
        };
        answers: ({
            matchQuestion: {
                question: {
                    id: string;
                    createdAt: Date;
                    imageUrl: string | null;
                    difficulty: number;
                    text: string;
                    explanation: string | null;
                };
            } & {
                id: string;
                order: number;
                questionId: string;
                startedAt: Date | null;
                endedAt: Date | null;
                matchId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            isCorrect: boolean;
            answerId: string;
            responseTimeMs: number;
            playerId: string;
            matchQuestionId: string;
        })[];
    } & {
        id: string;
        userId: string;
        score: number;
        team: number | null;
        isWinner: boolean | null;
        joinedAt: Date;
        matchId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    mode: import("@prisma/client").$Enums.GameMode;
    status: import("@prisma/client").$Enums.MatchStatus;
    maxPlayers: number;
    startedAt: Date | null;
    endedAt: Date | null;
}) | null>;
/**
 * Get user's match history
 */
export declare const getUserMatches: (userId: string, skip?: number, take?: number) => Promise<({
    match: {
        players: {
            userId: string;
            score: number;
            isWinner: boolean | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        mode: import("@prisma/client").$Enums.GameMode;
        status: import("@prisma/client").$Enums.MatchStatus;
        maxPlayers: number;
        startedAt: Date | null;
        endedAt: Date | null;
    };
} & {
    id: string;
    userId: string;
    score: number;
    team: number | null;
    isWinner: boolean | null;
    joinedAt: Date;
    matchId: string;
})[]>;
/**
 * Cancel a match
 */
export declare const cancelMatch: (matchId: string) => Promise<{
    id: string;
    createdAt: Date;
    mode: import("@prisma/client").$Enums.GameMode;
    status: import("@prisma/client").$Enums.MatchStatus;
    maxPlayers: number;
    startedAt: Date | null;
    endedAt: Date | null;
}>;
//# sourceMappingURL=gameService.d.ts.map