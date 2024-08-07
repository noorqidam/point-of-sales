import { check } from "express-validator";

export const update_user_validation = () => {
  return [
    check("firstName")
      .optional()
      .isLength({ min: 1, max: 40 })
      .withMessage("firstname harus antara 1 dan 40 karakter"),
    check("lastName")
      .optional()
      .isLength({ min: 1, max: 40 })
      .withMessage("lastname harus antara 1 dan 40 karakter"),
    check("email").optional().isEmail().withMessage("Email tidak valid"),
    check("birthDate")
      .optional()
      .isISO8601()
      .withMessage("Tanggal lahir harus berupa tanggal yang valid"),
    check("gender")
      .optional()
      .isIn(["male", "female"])
      .withMessage("Gender harus 'male' atau 'female'"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password harus minimal 6 karakter")
      .matches(/[A-Z]/)
      .withMessage("Password harus mengandung setidaknya satu huruf besar")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password harus mengandung setidaknya satu karakter khusus"),
  ];
};
