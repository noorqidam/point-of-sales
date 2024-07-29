import express from "express";
import {
  createTransactionController,
  listTransactionsController,
} from "../controllers/transaction.controller";
import { create_transaction_validation } from "../validations/transaction/transaction.validation";
import { isAuthenticated } from "../middleware/isAuthenticated";

export const transaction_route = express.Router();

transaction_route.post(
  "/",
  create_transaction_validation(),
  isAuthenticated,
  createTransactionController
);
transaction_route.get("/list", isAuthenticated, listTransactionsController);
