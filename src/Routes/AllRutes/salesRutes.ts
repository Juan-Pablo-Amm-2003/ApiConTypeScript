import { Router } from "express";
import {
  registerSale,
  getSaleById,
  getAllSales,
} from "../../controllers/salesController";

const router = Router();

// Ruta para registrar una venta
router.post("/register-sale", registerSale);

// Ruta para buscar una venta por ID
router.get("/:id", getSaleById); // Cambié la ruta de /sales/:id a /:id para evitar conflictos

// Ruta para ver todas las ventas
router.get("/", getAllSales); // Cambié la ruta de /sales a / para simplificar

export default router;
