import { body, check } from "express-validator";

const MAX_IMAGE_SIZE_IN_BYTES = 10 * 1024 * 1024;

export const create_product_validation = () => {
  return [
    check("productName").exists().withMessage("Product name is required"),
    check("productDescription")
      .exists()
      .withMessage("Product description is required"),
    check("productImage")
      .exists()
      .withMessage("Product image is required")
      .custom((value) => {
        const base64Length =
          (value.length * 3) / 4 -
          (value.indexOf("=") > 0 ? value.length - value.indexOf("=") : 0);
        const base64SizeInBytes = base64Length;

        if (base64SizeInBytes > MAX_IMAGE_SIZE_IN_BYTES) {
          throw new Error("Image size exceeds 10MB");
        }
        return true;
      }),
    check("categoryId").isInt().withMessage("Category ID must be an integer"),
    check("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),
  ];
};
