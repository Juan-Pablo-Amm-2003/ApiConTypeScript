import express from "express";
import ProductController from "../../controllers/productControllers";
import validateProduct from "../../middleware/validators/productValidator"; // Asegúrate de que la ruta es correcta

const productRoutes = express.Router();

// Rutas para obtener productos
productRoutes.get("/", ProductController.getAll);
productRoutes.get("/:id", ProductController.getById);
productRoutes.get("/name/:name", ProductController.getByName);
productRoutes.get("/category/:category", ProductController.getByCategory);
productRoutes.get("/price/:price", ProductController.getByPrice); // Corregido para usar "price"

// Ruta para crear un producto con validación
productRoutes.post("/create", validateProduct, ProductController.create);

// Rutas para eliminar y actualizar productos
productRoutes.delete("/:id", ProductController.delete);
productRoutes.patch("/:id", ProductController.update);

export default productRoutes;
