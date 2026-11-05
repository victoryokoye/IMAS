import { db } from "../../prisma/db";
import { or } from "@prisma/orm-postgres/orm-client";
import type { SortOrder } from "../types/express/index";

import type {
  CreateProjectInput,
  UpdateProjectInput,
  AssignInternsInput,
} from "./project.schema";

import type { ProjectSortField } from "./project.types";

// CREATE PROJECT
export const createProject = async (data: CreateProjectInput) => {
  const project = await db.orm.public.Project.create({
    name: data.name,
    ...(data.description !== undefined && {
      description: data.description,
    }),
    ...(data.department !== undefined && {
      department: data.department,
    }),
    ...(data.status !== undefined && {
      status: data.status,
    }),
    startDate: Temporal.Instant.from(data.startDate.toISOString()),
    endDate: Temporal.Instant.from(data.endDate.toISOString()),
  });

  return project;
};

// GET ALL PROJECTS
export const getAllProjects = async (
  search?: string,
  sortBy: ProjectSortField = "createdAt",
  order: SortOrder = "desc",
) => {
  const query = () =>
    search
      ? db.orm.public.Project.where((project) =>
          or(
            project.name.ilike(`%${search}%`),
            project.description.ilike(`%${search}%`),
            project.department.ilike(`%${search}%`),
          ),
        )
      : db.orm.public.Project;

  switch (sortBy) {
    case "name":
      return query()
        .orderBy((project) =>
          order === "asc" ? project.name.asc() : project.name.desc(),
        )
        .include("interns", (assignment) => assignment.include("intern"))
        .all();

    case "startDate":
      return query()
        .orderBy((project) =>
          order === "asc" ? project.startDate.asc() : project.startDate.desc(),
        )
        .include("interns", (assignment) => assignment.include("intern"))
        .all();

    case "endDate":
      return query()
        .orderBy((project) =>
          order === "asc" ? project.endDate.asc() : project.endDate.desc(),
        )
        .include("interns", (assignment) => assignment.include("intern"))
        .all();

    default:
      return query()
        .orderBy((project) =>
          order === "asc" ? project.createdAt.asc() : project.createdAt.desc(),
        )
        .include("interns", (assignment) => assignment.include("intern"))
        .all();
  }
};
// GET SINGLE PROJECT
export const getSingleProject = async (id: string) => {
  const project = await db.orm.public.Project.where({ id })
    .include("interns", (assignment) => assignment.include("intern"))
    .first();

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

// UPDATE PROJECT
export const updateProject = async (id: string, data: UpdateProjectInput) => {
  const existingProject = await db.orm.public.Project.where({ id }).first();

  if (!existingProject) {
    throw new Error("Project not found");
  }

  const startDate = data.startDate ?? existingProject.startDate;
  const endDate = data.endDate ?? existingProject.endDate;

  if (endDate < startDate) {
    throw new Error("End date cannot be before start date");
  }

  const updateData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  );

  const project = await db.orm.public.Project.where({ id }).update({
    ...updateData,
    ...(data.startDate !== undefined && {
      startDate: Temporal.Instant.from(data.startDate.toISOString()),
    }),
    ...(data.endDate !== undefined && {
      endDate: Temporal.Instant.from(data.endDate.toISOString()),
    }),
  });

  return project;
};

// DELETE PROJECT
export const deleteProject = async (id: string) => {
  const project = await db.orm.public.Project.where({ id }).delete();

  if (!project) {
    throw new Error("Project not found");
  }

  return { message: "Project deleted successfully" };
};

// ASSIGN INTERNS TO PROJECT
export const assignInternsToProject = async (
  projectId: string,
  data: AssignInternsInput,
) => {
  return db.transaction(async (tx) => {
    const project = await tx.orm.public.Project.where({
      id: projectId,
    }).first();

    if (!project) {
      throw new Error("Project not found");
    }

    const interns = await tx.orm.public.Intern.where((intern) =>
      intern.id.in(data.internIds),
    ).all();

    if (interns.length !== data.internIds.length) {
      throw new Error("One or more interns do not exist");
    }

    // Check for existing assignments
    for (const internId of data.internIds) {
      const existingAssignment = await tx.orm.public.ProjectIntern.where({
        projectId,
        internId,
      }).first();

      if (existingAssignment) {
        throw new Error(
          "One or more interns are already assigned to this project",
        );
      }
    }

    await tx.orm.public.ProjectIntern.createAll(
      data.internIds.map((internId) => ({
        projectId,
        internId,
      })),
    );

    return tx.orm.public.Project.where({ id: projectId })
      .include("interns", (assignment) => assignment.include("intern"))
      .first();
  });
};

// REMOVE INTERN FROM PROJECT
export const removeInternFromProject = async (
  projectId: string,
  internId: string,
) => {
  const assignment = await db.orm.public.ProjectIntern.where({
    projectId,
    internId,
  }).first();

  if (!assignment) {
    throw new Error("Intern is not assigned to this project");
  }

  await db.orm.public.ProjectIntern.where({ id: assignment.id }).delete();

  return { message: "Intern removed from project successfully" };
};
