import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../services/product.service";
import { validationResult } from "express-validator";

export const create_product = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productName, productDescription, productImage, categoryId, stock } =
    req.body;

  try {
    const product = await createProduct(
      productName,
      productDescription,
      productImage,
      categoryId,
      stock
    );
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const get_product = async (req: Request, res: Response) => {
  try {
    const product = await getProduct(parseInt(req.params.id));
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const update_product = async (req: Request, res: Response) => {
  const { productName, productDescription, productImage, categoryId, stock } =
    req.body;
  const { id } = req.params;

  try {
    const product = await updateProduct(
      parseInt(id, 10),
      productName,
      productDescription,
      productImage,
      categoryId,
      stock
    );
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const delete_product = async (req: Request, res: Response) => {
  try {
    const product = await deleteProduct(parseInt(req.params.id));
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const list_products = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;
  const productName = (req.query.productName as string) || "";

  try {
    const { products, total, totalPages } = await listProducts(
      page,
      perPage,
      productName
    );
    res.status(200).json({ products, total, totalPages, page, perPage });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
