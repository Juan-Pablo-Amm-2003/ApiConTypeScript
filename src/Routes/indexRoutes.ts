import { Router } from "express";
import categoriesRouter from "./AllRutes/categotyRutes";
import productRoutes from "./AllRutes/prductsRutes";
import userRoutes from "./AllRutes/userRutes";
import { validateRequest, validateUserCreation } from "../middleware/validators/userValidator";
import { loginUser, registerUser } from "../controllers/userControllers";

const router = Router();

router.use("/categories", categoriesRouter);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.post("/login", loginUser);
router.post("/register", validateUserCreation, validateRequest, registerUser);


export default router;
