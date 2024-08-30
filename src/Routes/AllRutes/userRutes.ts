import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
} from "../../controllers/userControllers";
import {
  validateUserCreation,
  validateRequest,
} from "../../middleware/validators/userValidator";
import { authenticateToken } from "../../middleware/jwt/authToken";

const router = Router();

// Rutas públicas
router.post("/login", loginUser);
router.post("/register", validateUserCreation, validateRequest, registerUser);

// Rutas protegidas
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.post(
  "/",
  authenticateToken,
  validateUserCreation,
  validateRequest,
  createUser
);
router.put(
  "/:id",
  authenticateToken,
  validateUserCreation,
  validateRequest,
  updateUser
);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
