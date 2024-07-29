import express from "express";
import { login_user, logout_user } from "../controllers/auth.controller";
import { login_user_validation } from "../validations/auth/auth_user.validation";
import { isAuthenticated } from "../middleware/isAuthenticated";

export const auth_route = express.Router();

auth_route.post("/login", login_user_validation(), login_user);
auth_route.post("/logout", isAuthenticated, logout_user);
