import { Router } from "express";

import {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  assignInternsToProject,
  removeInternFromProject,
} from "./project.controller";

const router: Router = Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/:id", getSingleProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

router.post("/:id/interns", assignInternsToProject);
router.delete("/:id/interns/:internId", removeInternFromProject);

export default router;
