import { Schema, model, Model, ObjectId } from "mongoose";

export interface IExpense {
	user: ObjectId;
	category: ObjectId;
	concept: string;
	amount: number;
	timestamp: Date;
}

const ExpenseSchema = new Schema<IExpense>({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	concept: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
	},
});

const Expense: Model<IExpense> = model<IExpense>("Expense", ExpenseSchema);

export default Expense;
