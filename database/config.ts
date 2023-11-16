import mongoose from "mongoose";
import { main } from "../prompts/main";

export const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(
			"mongodb+srv://facundokisser:QmP95DevmNTDY1lD@gastos.1iac90g.mongodb.net/"
		);
		console.log("BDD online");
		main();
	} catch (error) {
		console.log(error);
		throw new Error("Error al conectar con la base de datos");
	}
};
