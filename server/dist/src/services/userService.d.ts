export interface CreateUserInput {
    supabaseId: string;
    email?: string;
    username?: string;
    avatarUrl?: string;
    countryCode?: string;
    languageCode?: string;
}
export interface UpdateUserInput {
    username?: string;
    avatarUrl?: string;
    countryCode?: string;
    languageCode?: string;
}
/**
 * Create a new user
 */
export declare const createUser: (data: CreateUserInput) => Promise<{
    id: string;
    supabaseId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    autoDetect: boolean;
    level: number;
    xp: number;
    coins: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    lastHeartRefill: Date | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    languageCode: string | null;
    countryCode: string | null;
}>;
/**
 * Get user by ID
 */
export declare const getUserById: (userId: string) => Promise<{
    language: {
        name: string;
        code: string;
    } | null;
    country: {
        name: string;
        code: string;
    } | null;
    daily: {
        id: string;
        userId: string;
        lastClaimDate: Date | null;
        streak: number;
    } | null;
} & {
    id: string;
    supabaseId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    autoDetect: boolean;
    level: number;
    xp: number;
    coins: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    lastHeartRefill: Date | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    languageCode: string | null;
    countryCode: string | null;
}>;
/**
 * Get user by Supabase ID
 */
export declare const getUserBySupabaseId: (supabaseId: string) => Promise<{
    language: {
        name: string;
        code: string;
    } | null;
    country: {
        name: string;
        code: string;
    } | null;
    daily: {
        id: string;
        userId: string;
        lastClaimDate: Date | null;
        streak: number;
    } | null;
} & {
    id: string;
    supabaseId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    autoDetect: boolean;
    level: number;
    xp: number;
    coins: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    lastHeartRefill: Date | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    languageCode: string | null;
    countryCode: string | null;
}>;
/**
 * Update user profile
 */
export declare const updateUser: (userId: string, data: UpdateUserInput) => Promise<{
    language: {
        name: string;
        code: string;
    } | null;
    country: {
        name: string;
        code: string;
    } | null;
    daily: {
        id: string;
        userId: string;
        lastClaimDate: Date | null;
        streak: number;
    } | null;
} & {
    id: string;
    supabaseId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    autoDetect: boolean;
    level: number;
    xp: number;
    coins: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    lastHeartRefill: Date | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    languageCode: string | null;
    countryCode: string | null;
}>;
/**
 * Get user stats (XP, level, rank, etc.)
 */
export declare const getUserStats: (userId: string) => Promise<{
    xp: number;
    level: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    coins: number;
    isPremium: boolean;
}>;
/**
 * Get all users (paginated)
 */
export declare const getAllUsers: (skip?: number, take?: number) => Promise<{
    id: string;
    username: string | null;
    avatarUrl: string | null;
    level: number;
    xp: number;
    rank: import("@prisma/client").$Enums.Rank;
    countryCode: string | null;
}[]>;
/**
 * Update user XP and level
 */
export declare const addUserXp: (userId: string, amount: number, reason: string) => Promise<{
    id: string;
    supabaseId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    autoDetect: boolean;
    level: number;
    xp: number;
    coins: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    lastHeartRefill: Date | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    languageCode: string | null;
    countryCode: string | null;
}>;
/**
 * Add coins to user
 */
export declare const addUserCoins: (userId: string, amount: number) => Promise<{
    id: string;
    supabaseId: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    autoDetect: boolean;
    level: number;
    xp: number;
    coins: number;
    rank: import("@prisma/client").$Enums.Rank;
    hearts: number;
    maxHearts: number;
    lastHeartRefill: Date | null;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
    languageCode: string | null;
    countryCode: string | null;
}>;
//# sourceMappingURL=userService.d.ts.map