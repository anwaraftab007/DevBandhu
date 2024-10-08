import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { registerUser, login, logout, changePassword, getUser, updateSkills } from "../controllers/user.controller.js";
import { createProject, joinProject, exitProject } from "../controllers/project.controller.js";

const router = Router();

router.route("/register").post(
	upload.fields([{ name: "avatar", maxCount: 1 }]),
	registerUser
);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/changePassword").post(verifyJWT, changePassword);
router.route("/getUser").post(verifyJWT, getUser);
router.route("/updateSkills").post(verifyJWT, updateSkills);

router.route("/createProject").post(verifyJWT, createProject);
router.route("/joinProject").post(verifyJWT, joinProject);
router.route("/exitProject").post(verifyJWT, exitProject);

export default router;
