import { Router } from "express";
import {
	createExpense,
	deleteExpense,
	getAllExpenses,
	getExpensesByUser,
	updateExpense,
} from "../controllers/expenses";

const router = Router();

router.get("/", getAllExpenses);
router.get("/:DNI", getExpensesByUser);
// router.get("/:DATE1/:DATE2", getExpensesByDate);
router.post("/", createExpense);
router.put("/:ID", updateExpense);
router.patch("/:ID", updateExpense);
router.delete("/:ID", deleteExpense);

export default router;
