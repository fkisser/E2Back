import { Request, Response } from "express";
import User, { IUser } from "../models/users";

export const getAllUsers = async (req: Request, res: Response) => {
	const users = await User.find();
	res.json({
		users,
	});
};
const getUserByDNI = async (req: Request, res: Response) => {
	const { VALUE } = req.params;
	const user: IUser | null = await User.findOne({ dni: VALUE });
	user
		? res.json({
				user,
		  })
		: res.json({
				msj: "No se encontraron usuarios con ese DNI",
		  });
};
const getUsersByName = async (req: Request, res: Response) => {
	const { VALUE } = req.params;
	const condition = new RegExp(VALUE, "i");
	const users: IUser[] | null = await User.find({ name: condition });
	users.length
		? res.json({
				users,
		  })
		: res.json({
				msj: "No se encontraron usuarios con ese nombre",
		  });
};
export const getUsersByOption = async (req: Request, res: Response) => {
	const { OPTION } = req.params;
	switch (OPTION.toLowerCase()) {
		case "dni":
			getUserByDNI(req, res);
			break;
		case "nombre":
			getUsersByName(req, res);
			break;
		default:
			res.json({
				msj: "La opción no es válida",
			});
			break;
	}
};

export const createUser = async (req: Request, res: Response) => {
	const UserData: IUser = req.body;
	const user = new User(UserData);
	if (!user.name || !user.dni || !user.mail) {
		res.json({
			msg: "Ingrese todos los datos solicitados",
		});
		return;
	}
	user.name = user.name.trim();
	user.mail = user.mail.trim();

	const userDNI: IUser | null = await User.findOne({ dni: user.dni });
	if (userDNI) {
		res.json({
			msg: "Ya existe un usuario con ese DNI",
		});
		return;
	}
	const userMail = await User.findOne({ mail: user.mail });
	if (userMail) {
		res.json({
			msg: "Ya existe un usuario con ese mail",
		});
		return;
	}

	await user.save();

	res.json({
		msg: "Usuario creado con éxito",
		user,
	});
};
export const updateUser = async (req: Request, res: Response) => {
	const { DNI } = req.params;
	const data = req.body;
	Object.keys(data).forEach((key) => {
		if (key !== "dni") data[key] = data[key].trim();
	});
	if (Object.keys(data).includes("dni")) {
		const userDNI: IUser | null = await User.findOne({ dni: data.dni });
		if (userDNI) {
			res.json({
				msg: "Ya existe un usuario con ese DNI",
			});
			return;
		}
	}
	if (Object.keys(data).includes("mail")) {
		const userMail = await User.findOne({ mail: data.mail });
		if (userMail) {
			res.json({
				msg: "Ese Mail ya está registrado en la base de datos",
			});
			return;
		}
	}
	const user = await User.findOneAndUpdate(
		{ dni: DNI },
		{ ...data },
		{
			new: true,
		}
	);
	user
		? res.json({
				msg: "Usuario actualizado con éxito",
				user,
		  })
		: res.json({
				msg: "Usuario inválido",
		  });
};
export const deleteUser = async (req: Request, res: Response) => {
	const { DNI } = req.params;

	const user = await User.findOneAndDelete({ dni: DNI });
	user
		? res.json({
				msg: "Usuario eliminado con éxito",
				user,
		  })
		: res.json({
				msg: "Usuario inválido",
		  });
};
