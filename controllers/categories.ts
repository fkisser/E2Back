import { Request, Response } from "express";
import Category, { ICategory } from "../models/categories";

export const getAllCategories = async (req: Request, res: Response) => {
	const categories = await Category.find();
	res.json({
		categories,
	});
};
export const getCategoryByCode = async (req: Request, res: Response) => {
	const { CODE } = req.params;
	const category = await Category.findOne({ code: CODE });
	category
		? res.json({
				category,
		  })
		: res.json({
				msj: "No existen categorias con ese código",
		  });
};

export const createCategory = async (req: Request, res: Response) => {
	const categoryData: ICategory = req.body;
	const category = new Category(categoryData);
	if (!category.name || !category.code) {
		res.json({
			msg: "Ingrese al menos nombre y código",
		});
		return;
	}
	const categoryName: ICategory | null = await Category.findOne({
		name: category.name.trim(),
	});
	if (categoryName) {
		res.json({
			msg: "Ya existe una categoría con ese nombre",
		});
		return;
	}
	const categoryCode = await Category.findOne({ code: category.code });
	if (categoryCode) {
		res.json({
			msg: "Ya existe una categoría con ese código",
		});
		return;
	}
	await category.save();

	res.json({
		msg: "Categoría creada con éxito",
		category,
	});
};
export const updateCategory = async (req: Request, res: Response) => {
	const { CODE } = req.params;
	const { ...data } = req.body;
	const category = await Category.findOne({ code: CODE }, data, {
		new: true,
	});
	res.json({
		msg: "Categoría modificada con éxito",
		category,
	});
};
export const deleteCategory = async (req: Request, res: Response) => {
	const { ID } = req.params;

	const category = await Category.findByIdAndDelete(ID);

	res.json({
		msg: "Categoría eliminada con éxito",
		category,
	});
};
