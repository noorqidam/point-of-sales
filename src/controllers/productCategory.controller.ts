import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  createProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
  deleteProductCategory,
} from "../services/productCategory.service";

export const createProductCategoryController = async (
  req: Request,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation errors", errors: errors.array() });
  }

  try {
    const category = await createProductCategory(req.body);
    res
      .status(201)
      .json({
        message: {
          type: "success",
          text: "Product category created successfully",
        },
        data: category,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
  }
};

export const getAllProductCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const searchCategory = (req.query.name as string) || "";
    const {
      categories,
      total,
      totalPages,
      currentPage,
      perPage: pageSize,
    } = await getAllProductCategories(page, perPage, searchCategory);
    res.status(200).json({
      message: {
        type: "success",
        text: "Product categories retrieved successfully",
      },
      data: categories,
      pagination: {
        page: currentPage,
        totalPage: totalPages,
        totalItems: total,
        start: (currentPage - 1) * pageSize,
        pageSize: pageSize,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
  }
};

export const getProductCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: { type: "error", text: "Invalid category ID" } });
  }

  try {
    const category = await getProductCategoryById(id);
    if (!category) {
      return res
        .status(404)
        .json({
          message: { type: "error", text: "Product category not found" },
        });
    }
    res.status(200).json({
      message: {
        type: "success",
        text: "Product category retrieved successfully",
      },
      data: category,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
  }
};

export const updateProductCategoryController = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: { type: "error", text: "Invalid category ID" } });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        message: { type: "error", text: "Validation errors" },
        errors: errors.array(),
      });
  }

  try {
    const updatedCategory = await updateProductCategory(id, req.body);
    if (!updatedCategory) {
      return res
        .status(404)
        .json({
          message: { type: "error", text: "Product category not found" },
        });
    }
    res.status(200).json({
      message: {
        type: "success",
        text: "Product category updated successfully",
      },
      data: updatedCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
  }
};

export const deleteProductCategoryController = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: { type: "error", text: "Invalid category ID" } });
  }

  try {
    const affectedRows = await deleteProductCategory(id);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: { type: "error", text: "Product category not found" },
        });
    }
    res
      .status(200)
      .json({
        message: {
          type: "success",
          text: "Product category deleted successfully",
        },
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
  }
};
