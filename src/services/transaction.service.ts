import { Request, Response } from "express";
import { Product, Transaction, TransactionDetail, User } from "../entities";

export const createTransaction = async (req: Request, res: Response) => {
  const { userId, transactionType, details } = req.body;

  try {
    // Validasi transaksi
    if (!["Stock In", "Stock Out"].includes(transactionType)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    // Cek apakah user ada
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Buat transaksi
    const transaction = new Transaction();
    transaction.user = user;
    transaction.transactionType = transactionType;
    transaction.transactionDate = new Date();
    await transaction.save();

    // Proses detail transaksi
    for (const detail of details) {
      const product = await Product.findOne({
        where: { id: detail.productId },
      });
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${detail.productId} not found` });
      }

      if (transactionType === "Stock Out" && product.stock < detail.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ID ${detail.productId}`,
        });
      }

      // Buat detail transaksi
      const transactionDetail = new TransactionDetail();
      transactionDetail.transaction = transaction;
      transactionDetail.product = product;
      transactionDetail.quantity = detail.quantity;
      await transactionDetail.save();

      // Update stok produk jika perlu
      if (transactionType === "Stock Out") {
        product.stock -= detail.quantity;
      } else if (transactionType === "Stock In") {
        product.stock += detail.quantity;
      }
      await product.save();
    }

    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

export const listTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find({
      relations: ["user", "details", "details.product"],
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
