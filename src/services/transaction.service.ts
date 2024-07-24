import { Request, Response } from "express";
import { Product, Transaction, TransactionDetail, User } from "../entities";

export function omitPassword(user: User): Omit<User, "password"> {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as Omit<User, "password">;
}

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

export const listTransactions = async (query: any) => {
  const { transactionType, transactionDate, page = 1, per_page = 10 } = query;

  const pageNumber = parseInt(page as string, 10);
  const perPageNumber = parseInt(per_page as string, 10);

  const queryBuilder = Transaction.createQueryBuilder("transaction")
    .leftJoinAndSelect("transaction.user", "user")
    .leftJoinAndSelect("transaction.details", "details")
    .leftJoinAndSelect("details.product", "product");

  if (transactionType) {
    queryBuilder.andWhere("transaction.transactionType = :transactionType", {
      transactionType,
    });
  }

  if (transactionDate) {
    const startDate = new Date(transactionDate as string);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); // end date is the next day to include the whole day of transactionDate
    queryBuilder.andWhere(
      "transaction.transactionDate BETWEEN :startDate AND :endDate",
      { startDate, endDate }
    );
  }

  queryBuilder.skip((pageNumber - 1) * perPageNumber).take(perPageNumber);

  const [transactions, totalRows] = await queryBuilder.getManyAndCount();

  // Remove password from each user in the transactions
  const transactionsWithoutPassword = transactions.map((transaction) => {
    if (transaction.user) {
      const userWithoutPassword = omitPassword(transaction.user);
      return {
        ...transaction,
        user: userWithoutPassword,
      };
    }
    return transaction;
  });

  const lastPage = Math.ceil(totalRows / perPageNumber);
  const nextPage = pageNumber < lastPage ? pageNumber + 1 : 0;
  const prevPage = pageNumber > 1 ? pageNumber - 1 : 0;

  return {
    transactions: transactionsWithoutPassword,
    meta: {
      page: pageNumber,
      per_page: perPageNumber,
      next_page: nextPage,
      prev_page: prevPage,
      last_page: lastPage,
      total_rows: totalRows,
    },
  };
};
