"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildCategories = exports.getRootCategories = exports.getCategory = exports.getAllCategories = exports.searchFigures = exports.getFiguresByCategory = exports.getFigure = exports.getAllFigures = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const figureService = __importStar(require("../services/figureService"));
/**
 * Get all figures
 */
exports.getAllFigures = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const figures = await figureService.getAllFigures(skip, take);
    res.json(figures);
});
/**
 * Get figure details
 */
exports.getFigure = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { figureId } = req.params;
    const figure = await figureService.getFigureById(figureId);
    res.json(figure);
});
/**
 * Get figures by category
 */
exports.getFiguresByCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId } = req.params;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    const figures = await figureService.getFiguresByCategory(categoryId, skip, take);
    res.json(figures);
});
/**
 * Search figures
 */
exports.searchFigures = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const query = req.query.q;
    const skip = parseInt(req.query.skip) || 0;
    const take = parseInt(req.query.take) || 20;
    if (!query) {
        res.status(400).json({ error: "Query parameter is required" });
        return;
    }
    const figures = await figureService.searchFigures(query, skip, take);
    res.json(figures);
});
/**
 * Get all categories
 */
exports.getAllCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const categories = await figureService.getAllCategories();
    res.json(categories);
});
/**
 * Get category details
 */
exports.getCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId } = req.params;
    const category = await figureService.getCategoryById(categoryId);
    res.json(category);
});
/**
 * Get root categories
 */
exports.getRootCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const categories = await figureService.getRootCategories();
    res.json(categories);
});
/**
 * Get child categories
 */
exports.getChildCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId } = req.params;
    const categories = await figureService.getChildCategories(categoryId);
    res.json(categories);
});
//# sourceMappingURL=figureController.js.map