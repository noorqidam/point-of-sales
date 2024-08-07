import express from "express";
import {
  auth_route,
  product_route,
  productCategoryRoute,
  transaction_route,
  user_route,
} from "./routes";
import "./database/db";
import { isAuthenticated } from "./middleware/isAuthenticated";
import cors from "cors";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3002"],
  })
);

app.use("/api/users", user_route);
app.use("/api/auth", auth_route);
app.use("/api/product-category", productCategoryRoute);
app.use("/api/product", product_route);
app.use("/api/transaction", transaction_route);
app.use(isAuthenticated);

app.listen(3002, () => {
  console.log("app running on port 3002");
});
