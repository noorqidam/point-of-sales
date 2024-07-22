import { Request, Response } from "express";
import {
  s_all_users,
  s_create_user,
  s_delete_user_by_id,
  s_get_user_by_id,
  s_update_user_by_id,
} from "../services/user.service";
import { validationResult } from "express-validator";

export const all_user = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const searchName = (req.query.name as string) || "";
    const { users, total, totalPages } = await s_all_users(
      page,
      perPage,
      searchName
    );
    res.status(200).json({
      users,
      total,
      page,
      perPage,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const create_user = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await s_create_user(req, res);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const get_user = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await s_get_user_by_id(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const delete_user = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const affectedRows = await s_delete_user_by_id(userId);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const update_user = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedUser = await s_update_user_by_id(userId, req.body);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
};
