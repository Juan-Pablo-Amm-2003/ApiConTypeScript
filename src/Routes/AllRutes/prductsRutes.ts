import express from "express";
import ProductController from "../../controllers/productControllers";
import upload from "../../config/multerConfig";

const productRoutes = express.Router();

// Rutas para obtener productos
productRoutes.get("/", ProductController.getAll);
productRoutes.get("/:id", ProductController.getById);
productRoutes.get("/name/:name", ProductController.getByName); // Nueva ruta para obtener por nombre
productRoutes.get("/category/:category", ProductController.getByCategory); // Nueva ruta para obtener por categoría
productRoutes.get("/price/:price", ProductController.getByPrice); // Nueva ruta para obtener por precio

// Ruta para manejar la carga de productos
productRoutes.post("/create", upload.single("image"), ProductController.create);

// Ruta para eliminar un producto
productRoutes.delete("/:id", ProductController.delete);

// Ruta para actualizar un producto
productRoutes.patch("/:id", ProductController.update);

export default productRoutes;
