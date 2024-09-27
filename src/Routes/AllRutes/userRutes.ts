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
import { authenticateToken, isAdmin } from "../../middleware/jwt/authToken";

const router = Router();

// Rutas públicas
router.post("/login", loginUser);
router.post("/register", validateUserCreation, validateRequest, registerUser);

// Rutas protegidas
router.get("/", getAllUsers);
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
  updateUser
);
router.delete("/:id",  deleteUser);

export default router;
