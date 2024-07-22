import { createConnection } from "typeorm";
import {
  Product,
  ProductCategory,
  Transaction,
  TransactionDetail,
  User,
} from "../entities";

export const db = createConnection({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "",
  database: "point_of_sales",
  entities: [Product, ProductCategory, Transaction, TransactionDetail, User],
  synchronize: true,
})
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
