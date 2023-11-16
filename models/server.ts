import express, { Express } from "express";
import { connectDB } from "../database/config";
import userRoutes from "../routes/users";
import categoriesRoutes from "../routes/categories";
import expensesRoutes from "../routes/expenses";
import { main } from "../prompts/main";

export class Server {
	app: Express;

	constructor() {
		this.app = express();
		this.listen();
		this.BDDconnect();
		this.middlewares();
		this.routes();
	}

	async BDDconnect(): Promise<void> {
		await connectDB();
	}

	middlewares(): void {
		this.app.use(express.json());
	}

	routes(): void {
		this.app.use("/usuarios", userRoutes);
		this.app.use("/categorias", categoriesRoutes);
		this.app.use("/gastos", expensesRoutes);
	}

	listen(): void {
		this.app.listen(8080, () => {
			console.log(`Corriendo en el puerto 8080`);
		});
	}
}
