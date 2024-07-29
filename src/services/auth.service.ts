import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";
import { invalidateToken } from "../store/tokenStore";

const JWT_SECRET = "secretinidigunakanuntuktest";
const JWT_REFRESH_SECRET = "refreshsecretselaluupdate";

export const s_login_user = async (email: string, password: string) => {
  const user = await User.findOneBy({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const { password: userPassword, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const s_logout_user = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    invalidateToken(token);
  }
  res.status(200).json({ type: "success", message: "Logout successful" });
};
