import { check } from "express-validator";

export const create_user_validation = () => {
  return [
    check("firstName")
      .exists()
      .withMessage("firstname is required")
      .isLength({ min: 1, max: 40 })
      .withMessage("firstname should be between 1 and 40 character"),
    check("lastName")
      .exists()
      .withMessage("lastname is required")
      .isLength({ min: 1, max: 40 })
      .withMessage("lastname should be between 1 and 40 character"),
    check("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Input is not a valid email"),
    check("birthDate")
      .exists()
      .withMessage("Birth date is required")
      .isISO8601()
      .withMessage("Birth date must be a valid date"),
    check("gender")
      .exists()
      .withMessage("Gender is required")
      .isIn(["male", "female"])
      .withMessage("Gender must be either 'male' or 'female'"),
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
