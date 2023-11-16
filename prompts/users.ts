import chalk from "chalk";
import inquirer from "inquirer";
import User, { IUser } from "../models/users";
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
				// await login();
				break;
			case 1:
				console.log(`Elegiste ${chalk.green("Ver/modificar gastos")}`);
				// await createUser();
				break;
			case 2:
				console.log(`Elegiste ${chalk.blue("Ver/modificar usuario")}`);
				// await createUser();
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
export const createUser = async (): Promise<void> => {
	let run = true;
	let user: IUser = new User();
	while (run) {
		const userName = await inquirer.prompt([
			{
				type: "input",
				name: "name",
				message: "Ingrese nombre y apellido",
			},
		]);
		if (!validateName(userName.name)) {
			console.log(
				`${chalk.red("Nombre y apellido no puede ser un campo vacío")}`
			);
		} else {
			user.name = userName.name;
			run = false;
		}
	}
	run = true;
	while (run) {
		const userDNI = await inquirer.prompt([
			{
				type: "number",
				name: "dni",
				message: "Ingrese DNI",
			},
		]);
		if (!validateDNI(userDNI.dni)) {
			console.log(
				`${chalk.red("DNI debe ser un número entre 1.000.000 y 100.000.000")}`
			);
		} else {
			user.dni = userDNI.dni;
			run = false;
		}
	}
	run = true;
	while (run) {
		const userMail = await inquirer.prompt([
			{
				type: "input",
				name: "mail",
				message: "Ingrese mail",
			},
		]);
		if (!validateMail(userMail.mail)) {
			console.log(
				`${chalk.red("El mail debe tener formato correo@correo.dominio")}`
			);
		} else {
			user.mail = userMail.mail;
			run = false;
		}
	}
	console.log(user);
};
