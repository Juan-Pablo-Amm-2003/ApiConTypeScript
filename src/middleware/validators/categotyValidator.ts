import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import Category from "../../model/categoryModel";

// Middleware para validar una categoría
export const validateCategory = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string")
    .isLength({ max: 100 })
    .withMessage("Category name cannot be more than 100 characters")
    .custom(async (value) => {
      const existingCategory = await Category.findOne({
        where: { name: value },
      });
      if (existingCategory) {
        throw new Error("Category name already exists");
      }
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("Category description must be a string")
    .isLength({ max: 500 })
    .withMessage("Category description cannot be more than 500 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(({ msg }) => ({
      msg,
    }));
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware para validar un ID
export const validateID = [
  param("id").isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(({ msg }) => ({
      msg,
    }));
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
