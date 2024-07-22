import { check } from "express-validator";

export const createProductCategoryValidation = () => {
  return [
    check("categoryName")
      .exists()
      .withMessage("Category name is required")
      .isLength({ min: 1, max: 50 })
      .withMessage("Category name should be between 1 and 50 characters"),
    check("categoryDescription")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Category description should not exceed 255 characters"),
  ];
};

export const updateProductCategoryValidation = () => {
  return [
    check("categoryName")
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage("Category name should be between 1 and 50 characters"),
    check("categoryDescription")
      .optional()
      .isLength({ max: 255 })
      .withMessage("Category description should not exceed 255 characters"),
  ];
};
