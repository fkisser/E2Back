import inquirer from "inquirer";
import chalk from "chalk";
import { createUser, login } from "./users";

export const main = async () => {
	while (true) {
		const action = await inquirer.prompt([
			{
				type: "list",
				name: "selectedChoice",
				message: "APP de gastos",
				choices: [
					{
						value: 0,
						name: `${chalk.blue("Ingresar")}`,
					},
					{
						value: 1,
						name: `${chalk.yellow("Crear Usuario")}`,
					},
					{
						value: 99,
						name: `${chalk.red("SALIR")}`,
					},
				],
			},
		]);
		switch (action.selectedChoice) {
			case 0:
				console.log(`Elegiste ${chalk.blue("Ingresar")}`);
				await login();
				break;
			case 1:
				console.log(`Elegiste ${chalk.yellow("Crear usuario")}`);
				await createUser();
				break;
			case 99:
				console.log(`Elegiste ${chalk.red("SALIR")}`);
				process.exit();
			default:
				console.log(`Hubo un error`);
				break;
		}
	}
};
