import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Definir las validaciones para la creación de usuarios
export const validateUserCreation = [
  body("username").isString().notEmpty(),
  body("password").isString().notEmpty(),
  body("email").isEmail(),
  body("phone").isString().notEmpty(),
  body("addressLine1").isString().notEmpty(),
  body("city").isString().notEmpty(),
  body("state").isString().notEmpty(),
  body("postalCode").isString().notEmpty(),
  body("country").isString().notEmpty(),
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
