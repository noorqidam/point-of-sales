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
    const {
      users,
      total,
      page: currentPage,
      perPage: currentPerPage,
      totalPages,
    } = await s_all_users(page, perPage, searchName);
    const pagination = {
      page: currentPage,
      totalPage: totalPages,
      totalItems: total,
      start: (currentPage - 1) * currentPerPage,
      pageSize: currentPerPage,
    };
    res.status(200).json({
      message: { type: "success", text: "Users retrieved successfully" },
      data: { users },
      pagination: pagination,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const create_user = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation errors", errors: errors.array() });
  }

  const { firstName, lastName, email, birthDate, gender, password } = req.body;

  try {
    const user = await s_create_user(
      firstName,
      lastName,
      email,
      birthDate,
      gender,
      password
    );
    res.status(201).json({
      message: { type: "success", text: "User created successfully" },
      data: { user },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already in use") {
      res.status(400).json({
        message: { type: "error", text: error.message },
      });
    } else {
      res.status(500).json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
    }
  }
};

export const get_user = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res
      .status(400)
      .json({ message: { type: "error", text: "Invalid user ID" } });
  }

  try {
    const user = await s_get_user_by_id(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: { type: "error", text: "User not found" } });
    }

    res.status(200).json({
      message: { type: "success", text: "User retrieved successfully" },
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      message: { type: "error", text: "Internal server error" },
      error,
    });
  }
};

export const delete_user = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res
      .status(400)
      .json({ message: { type: "error", text: "Invalid user ID" } });
  }

  try {
    const affectedRows = await s_delete_user_by_id(userId);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: { type: "error", text: "User not found" } });
    }

    res.status(200).json({
      message: { type: "success", text: "User deleted successfully" },
    });
  } catch (error) {
    res.status(500).json({
      message: { type: "error", text: "Internal server error" },
      error,
    });
  }
};

export const update_user = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res
      .status(400)
      .json({ message: { type: "error", text: "Invalid user ID" } });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Validation errors", errors: errors.array() });
  }

  try {
    const updatedUser = await s_update_user_by_id(userId, req.body);
    res.status(200).json({
      message: { type: "success", text: "User updated successfully" },
      data: { user: updatedUser },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res
          .status(404)
          .json({ message: { type: "error", text: error.message } });
      }
      res.status(500).json({
        message: { type: "error", text: "Internal server error" },
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: { type: "error", text: "Internal server error" },
        error,
      });
    }
  }
};
