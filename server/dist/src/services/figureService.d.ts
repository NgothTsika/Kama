/**
 * Get all figures
 */
export declare const getAllFigures: (skip?: number, take?: number) => Promise<({
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
})[]>;
/**
 * Get figure by ID
 */
export declare const getFigureById: (figureId: string) => Promise<{
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
        figureId: string;
    })[];
    categories: ({
        category: {
            parent: {
                id: string;
                createdAt: Date;
                name: string;
                parentId: string | null;
            } | null;
            children: {
                id: string;
                createdAt: Date;
                name: string;
                parentId: string | null;
            }[];
        } & {
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
}>;
/**
 * Get figures by category
 */
export declare const getFiguresByCategory: (categoryId: string, skip?: number, take?: number) => Promise<({
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
})[]>;
/**
 * Search figures by name
 */
export declare const searchFigures: (query: string, skip?: number, take?: number) => Promise<({
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
})[]>;
/**
 * Get all categories
 */
export declare const getAllCategories: () => Promise<({
    figures: {
        categoryId: string;
        figureId: string;
    }[];
    parent: {
        id: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    } | null;
    children: {
        id: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    }[];
} & {
    id: string;
    createdAt: Date;
    name: string;
    parentId: string | null;
})[]>;
/**
 * Get category by ID
 */
export declare const getCategoryById: (categoryId: string) => Promise<{
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
        categoryId: string;
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
        categoryId: string;
        questionId: string;
    })[];
    parent: {
        id: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    } | null;
    children: {
        id: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    }[];
} & {
    id: string;
    createdAt: Date;
    name: string;
    parentId: string | null;
}>;
/**
 * Get root categories (no parent)
 */
export declare const getRootCategories: () => Promise<({
    children: ({
        children: {
            id: string;
            createdAt: Date;
            name: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    })[];
} & {
    id: string;
    createdAt: Date;
    name: string;
    parentId: string | null;
})[]>;
/**
 * Get child categories
 */
export declare const getChildCategories: (parentId: string) => Promise<({
    children: {
        id: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    }[];
} & {
    id: string;
    createdAt: Date;
    name: string;
    parentId: string | null;
})[]>;
//# sourceMappingURL=figureService.d.ts.map