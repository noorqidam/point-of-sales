import { Request, Response } from "express";
import {
  createTransaction,
  listTransactions,
} from "../services/transaction.service";

export const createTransactionController = async (
  req: Request,
  res: Response
) => {
  try {
    await createTransaction(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const listTransactionsController = async (
  req: Request,
  res: Response
) => {
  try {
    await listTransactions(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
