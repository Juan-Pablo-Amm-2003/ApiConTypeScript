import { Request, Response } from "express";
import Category from "../model/categoryModel";

// Obtener todas las categorías
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.json(category);
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Crear una categoría
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description } = req.body;
  try {
    if (description && typeof description !== "string") {
      res.status(400).json({ message: "Description must be a string" });
    } else {
      const category = await Category.create({ name, description });
      res.status(201).json(category);
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Actualizar una categoría
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const [updated] = await Category.update(
      { name, description },
      { where: { id } }
    );

    if (updated) {
      const updatedCategory = await Category.findByPk(id);
      res.json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Eliminar una categoría
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await Category.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
