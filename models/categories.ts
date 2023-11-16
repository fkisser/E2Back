import { Schema, model, Model, ObjectId } from "mongoose";

export interface ICategory {
	name: string;
	description?: string;
	code: string;
}

const CategorySchema = new Schema<ICategory>({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: false,
	},
	code: {
		type: String,
		required: true,
		unique: true,
	},
});

const Category: Model<ICategory> = model<ICategory>("Category", CategorySchema);

export default Category;
