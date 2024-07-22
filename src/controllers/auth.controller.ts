import { Request, Response } from "express";
import { s_login_user } from "../services/auth.service";

export const login_user = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await s_login_user(
      email,
      password
    );
    res.status(200).json({ user, accessToken, refreshToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
