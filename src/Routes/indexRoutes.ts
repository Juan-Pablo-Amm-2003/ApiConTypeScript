import { Router } from "express";
import categoriesRouter from "./AllRutes/categotyRutes";
import productRoutes from "./AllRutes/prductsRutes";
import userRoutes from "./AllRutes/userRutes";
import salesRouter from "./AllRutes/salesRutes";
import { loginUser, registerUser } from "../controllers/userControllers";
import {
  validateRequest,
  validateUserCreation,
} from "../middleware/validators/userValidator";
import { authenticateToken } from "../middleware/jwt/authToken";
const router = Router();

// Rutas públicas
router.post("/login", loginUser);
router.post("/register", validateUserCreation, validateRequest, registerUser);

// Rutas protegidas
router.use("/sales", authenticateToken, salesRouter);
router.use("/categories", authenticateToken, categoriesRouter);
router.use("/products", authenticateToken, productRoutes);
router.use("/users", authenticateToken, userRoutes);

export default router;
