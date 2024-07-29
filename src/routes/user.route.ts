import express from "express";
import {
  all_user,
  create_user,
  delete_user,
  get_user,
  update_user,
} from "../controllers/user.controller";
import { create_user_validation } from "../validations/user/create_user.validation";
import { isAuthenticated } from "../middleware/isAuthenticated";

export const user_route = express.Router();

user_route.get("/", isAuthenticated, all_user);
user_route.post("/", create_user_validation(), isAuthenticated, create_user);
user_route.get("/get-user/:id", isAuthenticated, get_user);
user_route.delete("/:id", isAuthenticated, delete_user);
user_route.put("/:id", create_user_validation(), isAuthenticated, update_user);
