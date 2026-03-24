/**
 * Get all questions
 */
export declare const getAllQuestions: (skip?: number, take?: number) => Promise<({
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
})[]>;
/**
 * Get question by ID
 */
export declare const getQuestionById: (questionId: string) => Promise<{
    lessons: ({
        lesson: {
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
        };
    } & {
        lessonId: string;
        questionId: string;
    })[];
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
}>;
/**
 * Get questions by category
 */
export declare const getQuestionsByCategory: (categoryId: string, skip?: number, take?: number) => Promise<({
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
})[]>;
/**
 * Get questions by lesson
 */
export declare const getQuestionsByLesson: (lessonId: string) => Promise<({
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
})[]>;
/**
 * Get random questions for a match
 */
export declare const getRandomQuestions: (count: number, difficulty?: number) => Promise<({
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
})[]>;
/**
 * Verify answer
 */
export declare const verifyAnswer: (questionId: string, answerId: string) => Promise<{
    isCorrect: boolean;
    correctAnswerId: string | undefined;
}>;
/**
 * Get flashcards for lesson
 */
export declare const getFlashcardsByLesson: (lessonId: string) => Promise<({
    reviews: {
        id: string;
        userId: string;
        nextReview: Date;
        flashcardId: string;
        interval: number;
    }[];
} & {
    id: string;
    question: string;
    lessonId: string;
    answer: string;
})[]>;
/**
 * Get user's flashcard reviews
 */
export declare const getUserFlashcardReviews: (userId: string) => Promise<({
    flashcard: {
        lesson: {
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
        };
    } & {
        id: string;
        question: string;
        lessonId: string;
        answer: string;
    };
} & {
    id: string;
    userId: string;
    nextReview: Date;
    flashcardId: string;
    interval: number;
})[]>;
/**
 * Update flashcard review (spaced repetition)
 */
export declare const updateFlashcardReview: (userId: string, flashcardId: string, quality: number) => Promise<{
    id: string;
    userId: string;
    nextReview: Date;
    flashcardId: string;
    interval: number;
}>;
//# sourceMappingURL=questionService.d.ts.map