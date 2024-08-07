import express from "express";
import {
  create_product,
  get_product,
  update_product,
  delete_product,
  list_products,
} from "../controllers/product.controller";
import { create_product_validation } from "../validations/product/product.validation";
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = express.Router();

router.post("/", create_product_validation(), isAuthenticated, create_product);
router.get("/:id", isAuthenticated, get_product);
router.patch("/:id", isAuthenticated, update_product);
router.delete("/:id", isAuthenticated, delete_product);
router.get("/", isAuthenticated, list_products);

export { router as product_route };
