import { Like } from "typeorm";
import { Product, ProductCategory } from "../entities";

export const createProduct = async (
  productName: string,
  productDescription: string,
  productImage: string,
  categoryId: number,
  stock: number
) => {
  const category = await ProductCategory.findOneBy({ id: categoryId });
  if (!category) {
    throw new Error("Category not found");
  }

  const product = Product.create({
    productName,
    productDescription,
    productImage,
    category,
    stock,
  });

  await product.save();
  return product;
};

export const getProduct = async (id: number): Promise<Product> => {
  const product = await Product.findOne({
    where: { id },
    relations: ["category"],
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const updateProduct = async (
  id: number,
  productName: string,
  productDescription: string,
  productImage: string,
  categoryId: number,
  stock: number
) => {
  const product = await Product.findOneBy({ id });
  if (!product) {
    throw new Error("Product not found");
  }

  const category = await ProductCategory.findOneBy({ id: categoryId });
  if (!category) {
    throw new Error("Category not found");
  }

  product.productName = productName;
  product.productDescription = productDescription;
  product.productImage = productImage;
  product.category = category;
  product.stock = stock;

  await product.save();
  return product;
};

export const deleteProduct = async (id: number): Promise<Product> => {
  const product = await Product.findOneBy({ id });
  if (!product) {
    throw new Error("Product not found");
  }

  await product.remove();
  return product;
};

export const listProducts = async (
  page: number,
  perPage: number,
  productName: string
): Promise<{ products: Product[]; total: number; totalPages: number }> => {
  const where = productName ? { productName: Like(`%${productName}%`) } : {};
  const [products, total] = await Product.findAndCount({
    where,
    relations: ["category"],
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const totalPages = Math.ceil(total / perPage);

  return { products, total, totalPages };
};
