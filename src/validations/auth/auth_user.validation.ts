import { check } from "express-validator";

export const login_user_validation = () => {
  return [
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Input is not a valid email"),
    check("password")
      .exists()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ];
};
