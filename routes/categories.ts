import { Router } from "express";
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getCategoryByCode,
	updateCategory,
} from "../controllers/categories";

const router = Router();

router.get("/", getAllCategories);
router.get("/:CODE", getCategoryByCode);
router.post("/", createCategory);
router.put("/:CODE", updateCategory);
router.patch("/:CODE", updateCategory);
router.delete("/:CODE", deleteCategory);

export default router;
