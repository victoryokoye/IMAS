import type { Request, Response } from "express";

import {
  createStaff as createStaffService,
  getAllStaff as getAllStaffService,
  getSingleStaff as getSingleStaffService,
  updateStaff as updateStaffService,
  updateStaffRole as updateStaffRoleService,
  updateStaffStatus as updateStaffStatusService,
} from "./staff.service";

// Create staff
export const createStaff = async (req: Request, res: Response) => {
  try {
    const staff = await createStaffService(req.body);
    const { password, ...staffResponse } = staff;

    return res.status(201).json({
      message: "Staff created successfully",
      data: staffResponse,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create staff",
    });
  }
};

// Get all staff
export const getAllStaff = async (_req: Request, res: Response) => {
  try {
    const staff = await getAllStaffService();

    const staffResponse = staff.map(({ password, ...details }) => details);

    return res.status(200).json({
      message: "Staff retrieved successfully",
      data: staffResponse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve staff",
    });
  }
};

// Get single staff
export const getSingleStaff = async (req: Request, res: Response) => {
  try {
    const staff = await getSingleStaffService(req.params.id as string);
    const { password, ...staffResponse } = staff;

    return res.status(200).json({
      message: "Staff retrieved successfully",
      data: staffResponse,
    });
  } catch (error) {
    return res.status(404).json({
      message: error instanceof Error ? error.message : "Staff not found",
    });
  }
};

// Update staff details
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const staff = await updateStaffService(req.params.id as string, req.body);
    const { password, ...staffResponse } = staff;

    return res.status(200).json({
      message: "Staff updated successfully",
      data: staffResponse,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to update staff",
    });
  }
};

// Update staff role
export const updateStaffRole = async (req: Request, res: Response) => {
  try {
    const staff = await updateStaffRoleService(
      req.params.id as string,
      req.body,
    );
    const { password, ...staffResponse } = staff;

    return res.status(200).json({
      message: "Staff role updated successfully",
      data: staffResponse,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to update staff role",
    });
  }
};

// Update staff status
export const updateStaffStatus = async (req: Request, res: Response) => {
  try {
    const staff = await updateStaffStatusService(
      req.params.id as string,
      req.body,
    );
    const { password, ...staffResponse } = staff;

    return res.status(200).json({
      message: "Staff status updated successfully",
      data: staffResponse,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update staff status",
    });
  }
};
