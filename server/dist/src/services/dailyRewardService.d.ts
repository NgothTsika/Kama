/**
 * Get user's daily reward status
 */
export declare const getDailyRewardStatus: (userId: string) => Promise<{
    canClaimToday: boolean;
    streak: number;
    nextReward: {
        readonly day: 1;
        readonly xpReward: 10;
        readonly coinReward: 50;
        readonly heartReward: 0;
    } | {
        readonly day: 2;
        readonly xpReward: 15;
        readonly coinReward: 75;
        readonly heartReward: 1;
    } | {
        readonly day: 3;
        readonly xpReward: 20;
        readonly coinReward: 100;
        readonly heartReward: 0;
    } | {
        readonly day: 4;
        readonly xpReward: 25;
        readonly coinReward: 125;
        readonly heartReward: 0;
    } | {
        readonly day: 5;
        readonly xpReward: 30;
        readonly coinReward: 150;
        readonly heartReward: 1;
    } | {
        readonly day: 6;
        readonly xpReward: 35;
        readonly coinReward: 175;
        readonly heartReward: 0;
    } | {
        readonly day: 7;
        readonly xpReward: 50;
        readonly coinReward: 250;
        readonly heartReward: 2;
    };
}>;
/**
 * Claim daily reward
 */
export declare const claimDailyReward: (userId: string) => Promise<{
    reward: {
        readonly day: 1;
        readonly xpReward: 10;
        readonly coinReward: 50;
        readonly heartReward: 0;
    } | {
        readonly day: 2;
        readonly xpReward: 15;
        readonly coinReward: 75;
        readonly heartReward: 1;
    } | {
        readonly day: 3;
        readonly xpReward: 20;
        readonly coinReward: 100;
        readonly heartReward: 0;
    } | {
        readonly day: 4;
        readonly xpReward: 25;
        readonly coinReward: 125;
        readonly heartReward: 0;
    } | {
        readonly day: 5;
        readonly xpReward: 30;
        readonly coinReward: 150;
        readonly heartReward: 1;
    } | {
        readonly day: 6;
        readonly xpReward: 35;
        readonly coinReward: 175;
        readonly heartReward: 0;
    } | {
        readonly day: 7;
        readonly xpReward: 50;
        readonly coinReward: 250;
        readonly heartReward: 2;
    };
    streak: number;
    user: {
        xp: number;
        coins: number;
        hearts: number;
    };
}>;
/**
 * Reset streak if needed (internal)
 */
export declare const resetStreakIfNeeded: (userId: string) => Promise<void>;
//# sourceMappingURL=dailyRewardService.d.ts.map