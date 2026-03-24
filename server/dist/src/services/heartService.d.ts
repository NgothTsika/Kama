/**
 * Get user's current hearts
 */
export declare const getUserHearts: (userId: string) => Promise<{
    hearts: number;
    maxHearts: number;
    isPremium: boolean;
}>;
/**
 * Deduct heart for wrong answer
 */
export declare const deductHeart: (userId: string, reason?: string) => Promise<{
    hearts: number;
    maxHearts: number;
}>;
/**
 * Refill hearts
 */
export declare const refillHearts: (userId: string) => Promise<{
    hearts: number;
    maxHearts: number;
}>;
/**
 * Add hearts (bonus, daily reward, etc.)
 */
export declare const addHearts: (userId: string, amount: number, reason?: string) => Promise<{
    hearts: number;
    maxHearts: number;
}>;
/**
 * Get heart logs for user
 */
export declare const getHeartLogs: (userId: string, limit?: number) => Promise<{
    id: string;
    createdAt: Date;
    reason: string;
    userId: string;
    change: number;
}[]>;
//# sourceMappingURL=heartService.d.ts.map