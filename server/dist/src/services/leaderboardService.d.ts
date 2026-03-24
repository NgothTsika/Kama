/**
 * Get weekly global leaderboard
 */
export declare const getGlobalLeaderboard: (weekOffset?: number, skip?: number, take?: number) => Promise<({
    user: {
        id: string;
        username: string | null;
        avatarUrl: string | null;
        level: number;
        rank: import("@prisma/client").$Enums.Rank;
    };
} & {
    id: string;
    xp: number;
    createdAt: Date;
    countryCode: string | null;
    userId: string;
    weekStart: Date;
    weekEnd: Date;
})[]>;
/**
 * Get country leaderboard
 */
export declare const getCountryLeaderboard: (countryCode: string, weekOffset?: number, skip?: number, take?: number) => Promise<({
    user: {
        id: string;
        username: string | null;
        avatarUrl: string | null;
        level: number;
        rank: import("@prisma/client").$Enums.Rank;
    };
} & {
    id: string;
    xp: number;
    createdAt: Date;
    countryCode: string | null;
    userId: string;
    weekStart: Date;
    weekEnd: Date;
})[]>;
/**
 * Get user's leaderboard rank (global)
 */
export declare const getUserGlobalRank: (userId: string, weekOffset?: number) => Promise<{
    rank: number | null;
    totalPlayers: number;
}>;
/**
 * Get user's leaderboard rank (country)
 */
export declare const getUserCountryRank: (userId: string, countryCode: string, weekOffset?: number) => Promise<{
    rank: number | null;
    totalPlayers: number;
}>;
/**
 * Update leaderboard for current week (call this periodically)
 */
export declare const updateWeeklyLeaderboard: () => Promise<void>;
/**
 * Get weekly rewards for a rank
 */
export declare const getWeeklyRewardByRank: (rank: number) => Promise<{
    xpReward: number;
    coinReward: number;
}>;
/**
 * Claim weekly leaderboard rewards
 */
export declare const claimWeeklyRewards: (userId: string) => Promise<{
    reward: {
        xpReward: number;
        coinReward: number;
    };
    rank: number;
    user: {
        xp: number;
        coins: number;
    };
}>;
//# sourceMappingURL=leaderboardService.d.ts.map