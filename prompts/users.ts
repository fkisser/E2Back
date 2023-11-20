import chalk from "chalk";
import inquirer from "inquirer";
import { IUser } from "../models/users";
import axios from "axios";
import {
	validateDNI,
	validateMail,
	validateName,
} from "../helpers/userValidations";

export const login = async (): Promise<void> => {
	let run = true;
	let userDNI;
	while (run) {
		userDNI = await inquirer.prompt([
			{
				type: "number",
				name: "selectUser",
				message: "Ingrese su DNI",
			},
		]);
		isNaN(userDNI.selectUser) ? (run = true) : (run = false);
	}
	try {
		const response = await axios.get(
			`http://localhost:8080/usuarios/dni/${userDNI.selectUser}`
		);
		const { name, dni, mail } = response.data.user;
		const user: IUser = { name, dni, mail };
		await selectedUser(user);
	} catch (error) {
		invalidUser();
	}
	return;
};
const selectedUser = async (user: IUser): Promise<void> => {
	let run = true;
	while (run) {
		const action = await inquirer.prompt([
			{
				type: "list",
				name: "selectedChoice",
				message: `Bienvenido/a ${user.name}`,
				choices: [
					{
						value: 0,
						name: `${chalk.yellow("Crear gasto")}`,
					},
					{
						value: 1,
						name: `${chalk.green("Ver/modificar gastos")}`,
					},
					{
						value: 2,
						name: `${chalk.blue("Ver/modificar Usuario")}`,
					},
					{
						value: 3,
						name: `Volver`,
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
				console.log(`Elegiste ${chalk.yellow("Crear gasto")}`);
				// await createExpense(user.dni);
				break;
			case 1:
				console.log(`Elegiste ${chalk.green("Ver/modificar gastos")}`);
				// await seeExpenses(user.dni);
				break;
			case 2:
				console.log(`Elegiste ${chalk.blue("Ver/modificar usuario")}`);
				run = await seeUser(user);
				break;
			case 3:
				console.log(`Elegiste Volver`);
				run = false;
				break;
			case 99:
				console.log(`Elegiste ${chalk.red("SALIR")}`);
				process.exit();
			default:
				console.log(`Hubo un error`);
				break;
		}
	}
	return;
};
const invalidUser = (): void => {
	console.log(
		`${chalk.red(
			"El DNI ingresado no pertenece a un usuario de la base de datos"
		)}`
	);
};
const inputName = async (name?: string): Promise<string> => {
	let run = true;
	while (run) {
		const userName = await inquirer.prompt([
			{
				type: "input",
				name: "name",
				message: "Ingrese nombre y apellido",
				default: `${name ? name : ""}`,
			},
		]);
		if (!validateName(userName.name)) {
			console.log(
				`${chalk.red("Nombre y apellido no puede ser un campo vacío")}`
			);
		} else {
			name = userName.name;
			run = false;
		}
	}
	return name || "";
};
const inputDNI = async (dni?: number): Promise<number> => {
	let run = true;
	while (run) {
		const userDNI = await inquirer.prompt([
			{
				type: "number",
				name: "dni",
				message: "Ingrese DNI",
				default: dni,
			},
		]);
		if (!validateDNI(userDNI.dni)) {
			console.log(
				`${chalk.red("DNI debe ser un número entre 1.000.000 y 100.000.000")}`
			);
		} else {
			dni = userDNI.dni;
			run = false;
		}
	}
	return dni || 0;
};
const inputMail = async (mail?: string): Promise<string> => {
	let run = true;
	while (run) {
		const userMail = await inquirer.prompt([
			{
				type: "input",
				name: "mail",
				message: "Ingrese mail",
				default: mail,
			},
		]);
		if (!validateMail(userMail.mail)) {
			console.log(
				`${chalk.red("El mail debe tener formato correo@correo.dominio")}`
			);
		} else {
			mail = userMail.mail;
			run = false;
		}
	}
	return mail || "";
};

export const createUser = async (): Promise<void> => {
	const name = await inputName();
	const dni = await inputDNI();
	const mail = await inputMail();
	const userData: IUser = { name, dni, mail };
	try {
		const response = await axios.post(
			`http://localhost:8080/usuarios`,
			userData
		);
		console.log(`${response.data.msg}`);
		await selectedUser(userData);
	} catch (error) {
		invalidUser();
	}
	return;
};
const seeUser = async (user: IUser): Promise<boolean> => {
	console.log(`
		Datos de usuario/a:
		Nombre: ${user.name}
		DNI: ${user.dni}
		Mail: ${user.mail}
	`);
	let run = true;
	while (run) {
		const action = await inquirer.prompt([
			{
				type: "list",
				name: "selectedChoice",
				message: `Seleccione una acción`,
				choices: [
					{
						value: 0,
						name: `${chalk.yellow("Modificar datos")}`,
					},
					{
						value: 1,
						name: `${chalk.redBright("Eliminar usuario (y sus gastos)")}`,
					},
					{
						value: 2,
						name: `Volver`,
					},
				],
			},
		]);
		switch (action.selectedChoice) {
			case 0:
				console.log(`Elegiste ${chalk.yellow("Modificar datos")}`);
				await modifyUser(user);
				break;
			case 1:
				console.log(
					`Elegiste ${chalk.redBright("Eliminar usuario (y sus gastos)")}`
				);
				await deleteUser(user.dni);
				run = false;
				break;
			case 2:
				console.log(`Elegiste Volver`);
				run = false;
				break;
			default:
				console.log(`Hubo un error`);
				break;
		}
	}
	return run;
};
const updateUser = async (dni: number, data: Partial<IUser>): Promise<void> => {
	try {
		const response = await axios.patch(
			`http://localhost:8080/usuarios/${dni}`,
			data
		);
		console.log(`${response.data.msg}`);
	} catch (error) {
		invalidUser();
	}
};
const modifyUser = async (user: IUser): Promise<void> => {
	let run = true;
	while (run) {
		const action = await inquirer.prompt([
			{
				type: "list",
				name: "selectedChoice",
				message: `Seleccione qué dato quiere modificar`,
				choices: [
					{
						value: 0,
						name: `Nombre y Apellido`,
					},
					{
						value: 1,
						name: `DNI`,
					},
					{
						value: 2,
						name: `Mail`,
					},
					{
						value: 3,
						name: `Volver`,
					},
				],
			},
		]);
		switch (action.selectedChoice) {
			case 0:
				user.name = await inputName(user.name);
				await updateUser(user.dni, { name: user.name });
				break;
			case 1:
				const newDNI = await inputDNI(user.dni);
				await updateUser(user.dni, { dni: newDNI });
				user.dni = newDNI;
				break;
			case 2:
				user.mail = await inputMail(user.mail);
				await updateUser(user.dni, { mail: user.mail });
				break;
			case 3:
				console.log(`Elegiste Volver`);
				run = false;
				break;
			default:
				console.log(`Hubo un error`);
				break;
		}
	}
	return;
};
const deleteUser = async (dni: number): Promise<void> => {
	const action = await inquirer.prompt([
		{
			type: "confirm",
			name: "delete",
			message: `¿Seguro/a que quiere eliminar este usuario y sus gastos?`,
			default: false,
		},
	]);
	if (action.delete) {
		try {
			const userExpenses = await axios.get(
				`http://localhost:8080/gastos/${dni}`
			);
			userExpenses.data.expenses.forEach(async (expense: any) => {
				await axios.delete(`http://localhost:8080/gastos/${expense._id}`);
			});
			console.log("Se han eliminado los gastos del usuario");
		} catch (error) {
			console.log("El usuario no tenía gastos registrados");
		}
		try {
			const response = await axios.delete(
				`http://localhost:8080/usuarios/${dni}`
			);
			console.log(`${response.data.msg}`);
		} catch (error) {
			invalidUser();
		}
	}
	return;
};
