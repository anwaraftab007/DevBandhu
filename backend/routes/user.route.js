import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, login, logout, changePassword, getUser, updateSkills } from "../controllers/user.controller.js";

const router = Router();

// User
router.route("/register").post(
	upload.fields([{ name: "avatar", maxCount: 1 }]),
	registerUser
);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/changePassword").post(verifyJWT, changePassword);
router.route("/").get(verifyJWT, getUser);
router.route("/updateSkills").put(verifyJWT, updateSkills);

export default router;
