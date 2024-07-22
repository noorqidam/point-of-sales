import express from "express";
import { login_user } from "../controllers/auth.controller";
import { login_user_validation } from "../validations/auth/auth_user.validation";

export const auth_route = express.Router();

auth_route.post("/login", login_user_validation(), login_user);
