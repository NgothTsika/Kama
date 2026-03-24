/**
 * Game Constants
 */
export declare const HEART_CONSTANTS: {
    readonly INITIAL_HEARTS: 5;
    readonly MAX_HEARTS: 5;
    readonly HEART_REFILL_TIME_HOURS: 1;
    readonly HEART_LOSS_WRONG_ANSWER: 1;
};
export declare const XP_CONSTANTS: {
    readonly LESSON_COMPLETION: 50;
    readonly CORRECT_ANSWER: 10;
    readonly DAILY_LOGIN: 5;
    readonly DUEL_WIN: 100;
    readonly TEAM_WIN: 75;
    readonly STREAK_BONUS: 25;
};
export declare const LEVEL_THRESHOLDS: {
    readonly 1: 0;
    readonly 2: 100;
    readonly 3: 250;
    readonly 4: 500;
    readonly 5: 1000;
    readonly 6: 2000;
    readonly 7: 3500;
    readonly 8: 5500;
    readonly 9: 8000;
    readonly 10: 12000;
};
export declare const RANKS: {
    readonly BRONZE: 0;
    readonly SILVER: 500;
    readonly GOLD: 2000;
    readonly DIAMOND: 5000;
    readonly LEGEND: 10000;
};
export declare const GAME_CONFIG: {
    readonly SOLO_QUESTIONS: 10;
    readonly DUEL_QUESTIONS: 10;
    readonly TEAM_QUESTIONS: 15;
    readonly TEAM_SIZE: 3;
    readonly MATCH_TIMEOUT_MINUTES: 30;
};
export declare const LEADERBOARD_CONFIG: {
    readonly WEEK_START: 0;
    readonly ENTRIES_PER_PAGE: 50;
    readonly TOP_REWARDS_COUNT: 100;
};
export declare const SUBSCRIPTION_COST: {
    readonly MONTHLY_COINS: 999;
    readonly YEARLY_COINS: 9999;
};
export declare const DAILY_REWARDS: readonly [{
    readonly day: 1;
    readonly xpReward: 10;
    readonly coinReward: 50;
    readonly heartReward: 0;
}, {
    readonly day: 2;
    readonly xpReward: 15;
    readonly coinReward: 75;
    readonly heartReward: 1;
}, {
    readonly day: 3;
    readonly xpReward: 20;
    readonly coinReward: 100;
    readonly heartReward: 0;
}, {
    readonly day: 4;
    readonly xpReward: 25;
    readonly coinReward: 125;
    readonly heartReward: 0;
}, {
    readonly day: 5;
    readonly xpReward: 30;
    readonly coinReward: 150;
    readonly heartReward: 1;
}, {
    readonly day: 6;
    readonly xpReward: 35;
    readonly coinReward: 175;
    readonly heartReward: 0;
}, {
    readonly day: 7;
    readonly xpReward: 50;
    readonly coinReward: 250;
    readonly heartReward: 2;
}];
//# sourceMappingURL=constants.d.ts.map