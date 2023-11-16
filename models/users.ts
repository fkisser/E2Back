import { Schema, model, Model } from "mongoose";

export interface IUser {
	name: string;
	dni: number;
	mail: string;
}

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		required: true,
	},
	dni: {
		type: Number,
		required: true,
		unique: true,
	},
	mail: {
		type: String,
		required: false,
	},
});

const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;
