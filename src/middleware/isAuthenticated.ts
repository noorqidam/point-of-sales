import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenInvalid } from "../store/tokenStore";

const JWT_SECRET = "secretinidigunakanuntuktest";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  if (isTokenInvalid(token)) {
    return res.status(401).json({ message: "Token has been invalidated" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }
    (req as any).user = user;
    next();
  });
};
