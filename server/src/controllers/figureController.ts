import { Response } from "express";
import { AuthRequest, asyncHandler } from "../middleware/errorHandler";
import * as figureService from "../services/figureService";

/**
 * Get all figures
 */
export const getAllFigures = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const figures = await figureService.getAllFigures(skip, take);
    res.json(figures);
  },
);

/**
 * Get figure details
 */
export const getFigure = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { figureId } = req.params;
    const figure = await figureService.getFigureById(figureId);
    res.json(figure);
  },
);

/**
 * Get figures by category
 */
export const getFiguresByCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { categoryId } = req.params;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const figures = await figureService.getFiguresByCategory(
      categoryId,
      skip,
      take,
    );
    res.json(figures);
  },
);

/**
 * Search figures
 */
export const searchFigures = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const query = req.query.q as string;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    if (!query) {
      res.status(400).json({ error: "Query parameter is required" });
      return;
    }

    const figures = await figureService.searchFigures(query, skip, take);
    res.json(figures);
  },
);

/**
 * Get all categories
 */
export const getAllCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const categories = await figureService.getAllCategories();
    res.json(categories);
  },
);

/**
 * Get category details
 */
export const getCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { categoryId } = req.params;
    const category = await figureService.getCategoryById(categoryId);
    res.json(category);
  },
);

/**
 * Get root categories
 */
export const getRootCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const categories = await figureService.getRootCategories();
    res.json(categories);
  },
);

/**
 * Get child categories
 */
export const getChildCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { categoryId } = req.params;
    const categories = await figureService.getChildCategories(categoryId);
    res.json(categories);
  },
);
