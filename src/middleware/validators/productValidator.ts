import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../../model/productModel";

const validateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string")
    .isLength({ max: 100 })
    .withMessage("Product name cannot be more than 100 characters")
    .custom(async (value) => {
      const existingProduct = await ProductModel.findOne({
        where: { name: value },
      });
      if (existingProduct) {
        throw new Error("Product name already exists");
      }
    }),
  body("category_id")
    .notEmpty()
    .withMessage("Product category is required")
    .isInt()
    .withMessage("Product category must be an integer"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ gt: 0 })
    .withMessage("Product price must be a number greater than 0"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(({ msg }) => {
      return {
        msg,
      };
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateProduct;
