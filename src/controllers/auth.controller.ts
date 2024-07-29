import { Request, Response } from "express";
import { s_login_user } from "../services/auth.service";
import { s_logout_user } from "../services/auth.service";

export const login_user = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { user, accessToken, refreshToken } = await s_login_user(
      email,
      password
    );
    res.status(200).json({
      message: { type: "success", text: "Login successful" },
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: { type: "error", text: error.message } });
    } else {
      res.status(400).json({
        message: { type: "error", text: "An unknown error occurred" },
      });
    }
  }
};

export const logout_user = (req: Request, res: Response) => {
  s_logout_user(req, res);
};
