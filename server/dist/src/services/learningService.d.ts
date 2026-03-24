/**
 * Get all learning paths
 */
export declare const getAllLearningPaths: (skip?: number, take?: number) => Promise<({
    lessons: {
        id: string;
        title: string;
        order: number;
    }[];
} & {
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    imageUrl: string | null;
    difficulty: number;
    isPublished: boolean;
})[]>;
/**
 * Get learning path by ID
 */
export declare const getLearningPathById: (pathId: string) => Promise<{
    lessons: ({
        figures: ({
            figure: {
                id: string;
                createdAt: Date;
                name: string;
                title: string | null;
                imageUrl: string | null;
                bio: string;
                birthYear: number | null;
                deathYear: number | null;
            };
        } & {
            lessonId: string;
            figureId: string;
        })[];
        questions: ({
            question: {
                id: string;
                createdAt: Date;
                imageUrl: string | null;
                difficulty: number;
                text: string;
                explanation: string | null;
            };
        } & {
            lessonId: string;
            questionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        title: string;
        imageUrl: string | null;
        summary: string;
        content: string;
        audioUrl: string | null;
        order: number;
        xpReward: number;
        pathId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    title: string;
    description: string | null;
    imageUrl: string | null;
    difficulty: number;
    isPublished: boolean;
}>;
/**
 * Get lesson by ID
 */
export declare const getLessonById: (lessonId: string) => Promise<{
    figures: ({
        figure: {
            categories: ({
                category: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    parentId: string | null;
                };
            } & {
                categoryId: string;
                figureId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            title: string | null;
            imageUrl: string | null;
            bio: string;
            birthYear: number | null;
            deathYear: number | null;
        };
    } & {
        lessonId: string;
        figureId: string;
    })[];
    questions: ({
        question: {
            answers: {
                id: string;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
            categories: ({
                category: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    parentId: string | null;
                };
            } & {
                categoryId: string;
                questionId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            imageUrl: string | null;
            difficulty: number;
            text: string;
            explanation: string | null;
        };
    } & {
        lessonId: string;
        questionId: string;
    })[];
    flashcards: {
        id: string;
        question: string;
        lessonId: string;
        answer: string;
    }[];
} & {
    id: string;
    createdAt: Date;
    title: string;
    imageUrl: string | null;
    summary: string;
    content: string;
    audioUrl: string | null;
    order: number;
    xpReward: number;
    pathId: string;
}>;
/**
 * Get user's learning path progress
 */
export declare const getUserPathProgress: (userId: string, pathId: string) => Promise<{
    id: string;
    userId: string;
    progress: number;
    pathId: string;
    completed: boolean;
}>;
/**
 * Get user's lesson progress
 */
export declare const getUserLessonProgress: (userId: string, lessonId: string) => Promise<{
    id: string;
    userId: string;
    completed: boolean;
    lessonId: string;
    score: number | null;
    completedAt: Date | null;
}>;
/**
 * Update lesson progress
 */
export declare const updateLessonProgress: (userId: string, lessonId: string, completed: boolean, score?: number) => Promise<{
    id: string;
    userId: string;
    completed: boolean;
    lessonId: string;
    score: number | null;
    completedAt: Date | null;
}>;
/**
 * Update path progress
 */
export declare const updatePathProgress: (userId: string, pathId: string) => Promise<{
    id: string;
    userId: string;
    progress: number;
    pathId: string;
    completed: boolean;
}>;
/**
 * Get all lessons in a path
 */
export declare const getLessonsByPath: (pathId: string) => Promise<({
    figures: ({
        figure: {
            id: string;
            createdAt: Date;
            name: string;
            title: string | null;
            imageUrl: string | null;
            bio: string;
            birthYear: number | null;
            deathYear: number | null;
        };
    } & {
        lessonId: string;
        figureId: string;
    })[];
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
        lessonId: string;
        questionId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    title: string;
    imageUrl: string | null;
    summary: string;
    content: string;
    audioUrl: string | null;
    order: number;
    xpReward: number;
    pathId: string;
})[]>;
//# sourceMappingURL=learningService.d.ts.map