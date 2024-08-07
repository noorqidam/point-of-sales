import express from "express";
import {
  createProductCategoryController,
  getAllProductCategoriesController,
  getProductCategoryByIdController,
  updateProductCategoryController,
  deleteProductCategoryController,
} from "../controllers/productCategory.controller";
import {
  createProductCategoryValidation,
  updateProductCategoryValidation,
} from "../validations/product/productCategory.validation";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.post(
  "/",
  createProductCategoryValidation(),
  isAuthenticated,
  createProductCategoryController
);
router.get("/", isAuthenticated, getAllProductCategoriesController);
router.get("/:id", isAuthenticated, getProductCategoryByIdController);
router.patch(
  "/:id",
  updateProductCategoryValidation(),
  isAuthenticated,
  updateProductCategoryController
);
router.delete("/:id", isAuthenticated, deleteProductCategoryController);

export { router as productCategoryRoute };
