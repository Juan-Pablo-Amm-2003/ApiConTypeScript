import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Definir las validaciones para la creación de usuarios

export const validateUserCreation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").optional().isString().withMessage("Phone must be a string"),
  body("addressLine1")
    .optional()
    .isString()
    .withMessage("Address Line 1 must be a string"),
  body("city").optional().isString().withMessage("City must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
  body("postalCode")
    .optional()
    .isString()
    .withMessage("Postal Code must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),
];

// Middleware para manejar los errores de validación
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
