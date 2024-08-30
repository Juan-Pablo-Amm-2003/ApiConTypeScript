import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/categotyControllers";
import {
  validateCategory,
  validateID,
} from "../../middleware/validators/categotyValidator";

const router = express.Router();


router.get("/", getAllCategories);
router.get("/:id", validateID, getCategoryById);
router.post("/", validateCategory, createCategory); 
router.put("/:id", validateID, validateCategory, updateCategory); 
router.delete("/:id", validateID, deleteCategory); 

export default router;
