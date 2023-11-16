import { Router } from "express";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getUsersByOption,
	updateUser,
} from "../controllers/users";

const router = Router();

router.get("/", getAllUsers);
router.get("/:OPTION/:VALUE", getUsersByOption);
router.post("/", createUser);
router.put("/:DNI", updateUser);
router.patch("/:DNI", updateUser);
router.delete("/:DNI", deleteUser);

export default router;
