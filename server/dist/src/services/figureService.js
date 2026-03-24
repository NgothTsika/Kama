"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildCategories = exports.getRootCategories = exports.getCategoryById = exports.getAllCategories = exports.searchFigures = exports.getFiguresByCategory = exports.getFigureById = exports.getAllFigures = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * Get all figures
 */
const getAllFigures = async (skip = 0, take = 20) => {
    return await prisma_1.default.figure.findMany({
        skip,
        take,
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllFigures = getAllFigures;
/**
 * Get figure by ID
 */
const getFigureById = async (figureId) => {
    const figure = await prisma_1.default.figure.findUnique({
        where: { id: figureId },
        include: {
            categories: {
                include: {
                    category: {
                        include: {
                            parent: true,
                            children: true,
                        },
                    },
                },
            },
            lessons: {
                include: {
                    lesson: true,
                },
            },
        },
    });
    if (!figure) {
        throw new errorHandler_1.AppError("Figure not found", 404);
    }
    return figure;
};
exports.getFigureById = getFigureById;
/**
 * Get figures by category
 */
const getFiguresByCategory = async (categoryId, skip = 0, take = 20) => {
    return await prisma_1.default.figure.findMany({
        skip,
        take,
        where: {
            categories: {
                some: {
                    categoryId,
                },
            },
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
};
exports.getFiguresByCategory = getFiguresByCategory;
/**
 * Search figures by name
 */
const searchFigures = async (query, skip = 0, take = 20) => {
    return await prisma_1.default.figure.findMany({
        skip,
        take,
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { title: { contains: query, mode: "insensitive" } },
                { bio: { contains: query, mode: "insensitive" } },
            ],
        },
        include: {
            categories: {
                include: {
                    category: true,
                },
            },
        },
    });
};
exports.searchFigures = searchFigures;
/**
 * Get all categories
 */
const getAllCategories = async () => {
    return await prisma_1.default.category.findMany({
        include: {
            parent: true,
            children: true,
            figures: true,
        },
        orderBy: { name: "asc" },
    });
};
exports.getAllCategories = getAllCategories;
/**
 * Get category by ID
 */
const getCategoryById = async (categoryId) => {
    const category = await prisma_1.default.category.findUnique({
        where: { id: categoryId },
        include: {
            parent: true,
            children: true,
            figures: {
                include: {
                    figure: true,
                },
            },
            questions: {
                include: {
                    question: true,
                },
            },
        },
    });
    if (!category) {
        throw new errorHandler_1.AppError("Category not found", 404);
    }
    return category;
};
exports.getCategoryById = getCategoryById;
/**
 * Get root categories (no parent)
 */
const getRootCategories = async () => {
    return await prisma_1.default.category.findMany({
        where: { parentId: null },
        include: {
            children: {
                include: {
                    children: true,
                },
            },
        },
        orderBy: { name: "asc" },
    });
};
exports.getRootCategories = getRootCategories;
/**
 * Get child categories
 */
const getChildCategories = async (parentId) => {
    return await prisma_1.default.category.findMany({
        where: { parentId },
        include: {
            children: true,
        },
        orderBy: { name: "asc" },
    });
};
exports.getChildCategories = getChildCategories;
//# sourceMappingURL=figureService.js.map