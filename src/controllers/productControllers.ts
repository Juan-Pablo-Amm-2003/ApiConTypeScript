import { Request, Response, NextFunction } from "express";
import { ProductModel } from "../model/productModel";
import { Op } from "sequelize";
import { ValidationError, DatabaseError } from "sequelize";

import cloudinary from "../config/cloudinaryConfig";
import streamifier from "streamifier";
import { error } from "console";

class ProductController {
  // Obtener todos los productos
  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await ProductModel.findAll();
      res.status(200).json({ message: "Get all products", products });
    } catch (error) {
      console.error("Error in getAll:", error);
      next(error);
    }
  }

  // Obtener producto por ID
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await ProductModel.findByPk(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json({ message: "Get product by Id", product });
    } catch (error) {
      console.error("Error in getById:", error);
      next(error);
    }
  }

  // Obtener producto por nombre
  static async getByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const name = req.params.name;
      const product = await ProductModel.findOne({ where: { name } });
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(200).json({ message: "Get product by name", product });
    } catch (error) {
      console.error("Error in getByName:", error);
      next(error);
    }
  }

  // Obtener productos por categoría
  static async getByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const category_id = parseInt(req.params.category, 10);
      if (isNaN(category_id)) {
        res.status(400).json({ message: "Invalid category ID" });
        return;
      }
      const products = await ProductModel.findAll({ where: { category_id } });
      if (products.length === 0) {
        res
          .status(404)
          .json({ message: "No products found for this category" });
        return;
      }
      res.status(200).json({ message: "Get products by category", products });
    } catch (error) {
      console.error("Error in getByCategory:", error);
      next(error);
    }
  }

  // Obtener productos por precio mínimo
  static async getByPrice(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const price = parseFloat(req.params.price);
      if (isNaN(price)) {
        res.status(400).json({ message: "Invalid price value" });
        return;
      }
      const products = await ProductModel.findAll({
        where: { price: { [Op.gte]: price } },
      });
      if (products.length === 0) {
        res.status(404).json({ message: "No products found for this price" });
        return;
      }
      res.status(200).json({ message: "Get products by price", products });
    } catch (error) {
      console.error("Error in getByPrice:", error);
      next(error);
    }
  }

  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, description, price, category_id, stock } = req.body;

      if (!name || !description || !price || !category_id) {
        const errores = console.log(error);
        return errores;
      }

      let imagePath = "";

      if (req.file) {
        const buffer = req.file.buffer;

        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "your_folder_name" },
            (error: any, result: any) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
                return reject(error);
              }
              imagePath = result.secure_url;
              resolve(undefined);
            }
          );

          streamifier.createReadStream(buffer).pipe(uploadStream);
        });
      } else {
        console.log("No file uploaded.");
      }

      const newProduct = await ProductModel.create({
        name,
        description,
        price,
        imagePath,
        category_id,
        stock: stock || 0,
      });

      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      next(error);
    }
  }

  // Eliminar un producto
  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("Delete request received for product ID:", req.params.id); // Log de entrada
    try {
      const id = parseInt(req.params.id, 10);
      const product = await ProductModel.findByPk(id);
      if (!product) {
        console.log("Product not found"); // Log si no se encuentra el producto
        res.status(404).json({ message: "Product not found" });
        return;
      }
      await product.destroy();
      console.log("Product deleted successfully"); // Log de éxito
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      next(error);
    }
  }

  // Actualizar un producto
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, description, price, imagePath, category_id } = req.body;
      const [updated] = await ProductModel.update(
        { name, description, price, imagePath, category_id },
        { where: { id } }
      );
      if (updated) {
        res.status(200).json({ message: "Product updated successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      next(error);
    }
  }
}

export default ProductController;
