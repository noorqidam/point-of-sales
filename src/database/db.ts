import dotenv from "dotenv";
import { createConnection } from "typeorm";
import {
  Product,
  ProductCategory,
  Transaction,
  TransactionDetail,
  User,
} from "../entities";

dotenv.config();

const dbType = process.env.TYPE as any;
const dbHost = process.env.HOST as string;
const dbPort = parseInt(process.env.PORT || "3306", 10);
const dbUsername = process.env.USERNAME as string;
const dbPassword = process.env.PASSWORD as string;
const dbName = process.env.DATABASE as string;

export const db = createConnection({
  type: dbType,
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  entities: [Product, ProductCategory, Transaction, TransactionDetail, User],
  synchronize: true,
})
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
