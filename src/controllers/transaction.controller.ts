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
      res.status(500).json({ message: { type: "error", text: error.message } });
    } else {
      res
        .status(500)
        .json({ message: { type: "error", text: "Internal server error" } });
    }
  }
};

export const listTransactionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await listTransactions(req.query);
    res.status(200).json({
      message: { type: "success", text: "Success" },
      data: result.transactions,
      pagination: result.pagination,
    });
    // await listTransactions(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: { type: "error", text: error.message } });
    } else {
      res
        .status(500)
        .json({ message: { type: "error", text: "Internal server error" } });
    }
  }
};
