import prisma from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";

/**
 * Get all figures
 */
export const getAllFigures = async (skip = 0, take = 20) => {
  return await prisma.figure.findMany({
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

/**
 * Get figure by ID
 */
export const getFigureById = async (figureId: string) => {
  const figure = await prisma.figure.findUnique({
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
    throw new AppError("Figure not found", 404);
  }

  return figure;
};

/**
 * Get figures by category
 */
export const getFiguresByCategory = async (
  categoryId: string,
  skip = 0,
  take = 20,
) => {
  return await prisma.figure.findMany({
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

/**
 * Search figures by name
 */
export const searchFigures = async (query: string, skip = 0, take = 20) => {
  return await prisma.figure.findMany({
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

/**
 * Get all categories
 */
export const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      parent: true,
      children: true,
      figures: true,
    },
    orderBy: { name: "asc" },
  });
};

/**
 * Get category by ID
 */
export const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
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
    throw new AppError("Category not found", 404);
  }

  return category;
};

/**
 * Get root categories (no parent)
 */
export const getRootCategories = async () => {
  return await prisma.category.findMany({
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

/**
 * Get child categories
 */
export const getChildCategories = async (parentId: string) => {
  return await prisma.category.findMany({
    where: { parentId },
    include: {
      children: true,
    },
    orderBy: { name: "asc" },
  });
};
