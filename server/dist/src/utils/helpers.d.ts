/**
 * Calculate user level based on XP
 */
export declare const calculateLevel: (xp: number) => number;
/**
 * Calculate user rank based on XP
 */
export declare const calculateRank: (xp: number) => string;
/**
 * Calculate XP needed to next level
 */
export declare const calculateXpToNextLevel: (xp: number) => number;
/**
 * Calculate hearts refill time
 */
export declare const calculateHeartRefillTime: (lastRefillTime: Date, maxHearts?: number) => number;
/**
 * Generate a random code for match joining
 */
export declare const generateMatchCode: () => string;
/**
 * Format date for week start (Monday)
 */
export declare const getWeekStart: (date?: Date) => Date;
/**
 * Format date for week end (Sunday)
 */
export declare const getWeekEnd: (date?: Date) => Date;
/**
 * Calculate match score based on correct answers and response time
 */
export declare const calculateMatchScore: (correctAnswers: number, totalQuestions: number, responseTimeMs: number, difficulty?: number) => number;
/**
 * Validate email format
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Validate username format
 */
export declare const isValidUsername: (username: string) => boolean;
//# sourceMappingURL=helpers.d.ts.map