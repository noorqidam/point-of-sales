import { Like } from "typeorm";
import { ProductCategory } from "../entities/productCategory.entity";

export const createProductCategory = async (data: Partial<ProductCategory>) => {
  const category = ProductCategory.create(data);
  await category.save();
  return category;
};

export const getAllProductCategories = async (
  page: number,
  perPage: number,
  name: string
) => {
  const where = name
    ? [
        { categoryName: Like(`%${name}%`) },
        { categoryDescription: Like(`%${name}%`) },
      ]
    : undefined;

  const [categories, total] = await ProductCategory.findAndCount({
    where,
    skip: (page - 1) * perPage,
    take: perPage,
  });

  return {
    categories,
    total,
    totalPages: Math.ceil(total / perPage),
    currentPage: page,
    perPage: perPage,
  };
};

export const getProductCategoryById = async (id: number) => {
  return await ProductCategory.findOneBy({ id });
};

export const updateProductCategory = async (
  id: number,
  data: Partial<ProductCategory>
) => {
  const category = await ProductCategory.findOneBy({ id });
  if (!category) return null;

  ProductCategory.merge(category, data);
  await category.save();
  return category;
};

export const deleteProductCategory = async (id: number) => {
  const result = await ProductCategory.delete({ id });
  return result.affected;
};
