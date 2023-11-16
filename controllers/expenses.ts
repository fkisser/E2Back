import { Request, Response } from "express";
import Expense, { IExpense } from "../models/expenses";
import User from "../models/users";
import Category from "../models/categories";

export const getAllExpenses = async (req: Request, res: Response) => {
	const expenses = await Expense.find()
		.populate("user", "name")
		.populate("category", "name");
	res.json({
		expenses,
	});
};
export const getExpensesByUser = async (req: Request, res: Response) => {
	const { DNI } = req.params;
	const user = await User.findOne({ dni: DNI });
	const expenses: IExpense[] | null = await Expense.find({ user: user?._id });
	res.json({
		expenses,
	});
};

export const createExpense = async (req: Request, res: Response) => {
	const expenseData: IExpense = req.body;
	const { user, category, ...data } = expenseData;
	const userData = await User.findOne({ dni: user });
	const categoryData = await Category.findOne({ name: category });
	const expense = new Expense({
		user: userData?._id,
		category: categoryData?._id,
		...data,
	});
	await expense.save();

	res.json({
		msg: "Gasto creado con éxito",
		expense,
	});
};
export const updateExpense = async (req: Request, res: Response) => {
	const { ID } = req.params;
	const { ...data } = req.body;
	const expense = await Expense.findByIdAndUpdate(ID, data, {
		new: true,
	});

	res.json({
		msg: "Gasto modificado con éxito",
		expense,
	});
};
export const deleteExpense = async (req: Request, res: Response) => {
	const { ID } = req.params;

	const expense = await Expense.findByIdAndDelete(ID);

	res.json({
		msg: "Gasto eliminado con éxito",
		expense,
	});
};
