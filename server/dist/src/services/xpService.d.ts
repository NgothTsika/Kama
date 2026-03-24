/**
 * Get total XP for user
 */
export declare const getUserXp: (userId: string) => Promise<{
    level: number;
    xp: number;
    rank: import("@prisma/client").$Enums.Rank;
}>;
/**
 * Get XP logs for user
 */
export declare const getXpLogs: (userId: string, limit?: number) => Promise<{
    id: string;
    createdAt: Date;
    amount: number;
    reason: string;
    userId: string;
}[]>;
/**
 * Get XP logs by reason (for analytics)
 */
export declare const getXpLogsByReason: (userId: string, reason: string) => Promise<{
    id: string;
    createdAt: Date;
    amount: number;
    reason: string;
    userId: string;
}[]>;
/**
 * Calculate total XP gained in period
 */
export declare const getTotalXpInPeriod: (userId: string, startDate: Date, endDate: Date) => Promise<number>;
//# sourceMappingURL=xpService.d.ts.map