import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProject, joinProject, exitProject, getProjects, getProjectById } from "../controllers/project.controller.js";

const router = Router();
router.route("/create").post(verifyJWT, createProject);
router.route("/join/:projectId").post(verifyJWT, joinProject);
router.route("/exit").delete(verifyJWT, exitProject);
router.route("/").get(getProjects);
router.route("/:projectId").get(getProjectById);

export default router;

