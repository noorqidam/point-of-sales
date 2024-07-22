import { body } from "express-validator";

export const create_transaction_validation = () => [
  body("userId")
    .isInt()
    .withMessage("User ID is required and must be an integer"),
  body("transactionType")
    .isIn(["Stock In", "Stock Out"])
    .withMessage("Transaction type must be 'Stock In' or 'Stock Out'"),
  body("details").isArray().withMessage("Details must be an array"),
  body("details.*.productId")
    .isInt()
    .withMessage("Product ID is required and must be an integer"),
  body("details.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
];
