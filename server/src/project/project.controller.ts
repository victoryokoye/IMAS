import type { Request, Response } from "express";

import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  assignInternsSchema,
} from "./project.schema";

import {
  createProject as createProjectService,
  getAllProjects as getAllProjectsService,
  getSingleProject as getSingleProjectService,
  updateProject as updateProjectService,
  deleteProject as deleteProjectService,
  assignInternsToProject as assignInternsToProjectService,
  removeInternFromProject as removeInternFromProjectService,
} from "./project.service";

// CREATE PROJECT
export const createProject = async (req: Request, res: Response) => {
  try {
    const result = createProjectSchema.safeParse(req.body);

    if (!result.success || !result.data) {
      return res.status(400).json({
        message: "Invalid project data",
        errors: result.error.issues,
      });
    }

    const project = await createProjectService(result.data);

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create project",
    });
  }
};

// GET ALL PROJECTS
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjectsService();

    return res.status(200).json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to retrieve projects",
    });
  }
};

// GET SINGLE PROJECT
export const getSingleProject = async (req: Request, res: Response) => {
  try {
    const result = projectIdSchema.safeParse(req.params);

    if (!result.success || !result.data) {
      return res.status(400).json({
        message: "Invalid project ID",
        errors: result.error.issues,
      });
    }

    const project = await getSingleProjectService(result.data.id);

    return res.status(200).json({
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to retrieve project",
    });
  }
};

// UPDATE PROJECT
export const updateProject = async (req: Request, res: Response) => {
  try {
    const paramsResult = projectIdSchema.safeParse(req.params);

    if (!paramsResult.success || !paramsResult.data) {
      return res.status(400).json({
        message: "Invalid project ID",
        errors: paramsResult.error.issues,
      });
    }

    const bodyResult = updateProjectSchema.safeParse(req.body);

    if (!bodyResult.success || !bodyResult.data) {
      return res.status(400).json({
        message: "Invalid project data",
        errors: bodyResult.error.issues,
      });
    }

    const project = await updateProjectService(
      paramsResult.data.id,
      bodyResult.data,
    );

    return res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to update project",
    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const result = projectIdSchema.safeParse(req.params);

    if (!result.success || !result.data) {
      return res.status(400).json({
        message: "Invalid project ID",
        errors: result.error.issues,
      });
    }

    const response = await deleteProjectService(result.data.id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete project",
    });
  }
};

// ASSIGN INTERNS TO PROJECT
export const assignInternsToProject = async (req: Request, res: Response) => {
  try {
    const paramsResult = projectIdSchema.safeParse(req.params);

    if (!paramsResult.success || !paramsResult.data) {
      return res.status(400).json({
        message: "Invalid project ID",
        errors: paramsResult.error.issues,
      });
    }

    const bodyResult = assignInternsSchema.safeParse(req.body);

    if (!bodyResult.success || !bodyResult.data) {
      return res.status(400).json({
        message: "Invalid intern assignment data",
        errors: bodyResult.error.issues,
      });
    }

    const project = await assignInternsToProjectService(
      paramsResult.data.id,
      bodyResult.data,
    );

    return res.status(200).json({
      message: "Interns assigned successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to assign interns",
    });
  }
};

// REMOVE INTERN FROM PROJECT
export const removeInternFromProject = async (req: Request, res: Response) => {
  try {
    const projectIdResult = projectIdSchema.safeParse({
      id: req.params.id,
    });

    if (!projectIdResult.success || !projectIdResult.data) {
      return res.status(400).json({
        message: "Invalid project ID",
        errors: projectIdResult.error.issues,
      });
    }

    const internIdResult = projectIdSchema.safeParse({
      id: req.params.internId,
    });

    if (!internIdResult.success || !internIdResult.data) {
      return res.status(400).json({
        message: "Invalid intern ID",
        errors: internIdResult.error.issues,
      });
    }

    const response = await removeInternFromProjectService(
      projectIdResult.data.id,
      internIdResult.data.id,
    );

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to remove intern from project",
    });
  }
};
