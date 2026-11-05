import type { Request, Response } from "express";
import {
  createInternSchema,
  updateInternSchema,
  updateInternStatusSchema,
  setInternPinSchema,
  verifyInternPinSchema,
  listInternsQuerySchema,
} from "./intern.schema";
import {
  createIntern as createInternService,
  getAllInterns as getAllInternsService,
  getSingleIntern as getSingleInternService,
  updateIntern as updateInternService,
  updateInternStatus as updateInternStatusService,
  setInternPin as setInternPinService,
  verifyInternPin as verifyInternPinService,
} from "./intern.service";

// Create an intern
export const createIntern = async (req: Request, res: Response) => {
  const validation = createInternSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const result = await createInternService(validation.data);

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Intern with this email already exists"
    ) {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Create intern error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get all interns
export const getAllInterns = async (req: Request, res: Response) => {
  const validation = listInternsQuerySchema.safeParse(req.query);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      message: "Invalid pagination parameters",
      errors: validation.error.flatten(),
    });
  }

  try {
    const interns = await getAllInternsService();

    return res.status(200).json({
      status: "success",
      data: interns,
      meta: {
        page: validation.data.page,
        limit: validation.data.limit,
        total: interns.length,
        totalPages: Math.ceil(interns.length / validation.data.limit),
      },
    });
  } catch (error) {
    console.error("Get interns error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get one intern
export const getSingleIntern = async (req: Request, res: Response) => {
  try {
    const intern = await getSingleInternService(req.params.id as string);

    return res.status(200).json({
      status: "success",
      data: intern,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Intern not found") {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Get intern error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update an intern
export const updateIntern = async (req: Request, res: Response) => {
  const validation = updateInternSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const intern = await updateInternService(
      req.params.id as string,
      validation.data,
    );

    return res.status(200).json({
      status: "success",
      data: intern,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Intern not found") {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Intern with this email already exists"
    ) {
      return res.status(409).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Update intern error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update intern status
export const updateInternStatus = async (req: Request, res: Response) => {
  const validation = updateInternStatusSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const intern = await updateInternStatusService(
      req.params.id as string,
      validation.data,
    );

    return res.status(200).json({
      status: "success",
      data: intern,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Intern not found") {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Update intern status error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Set or reset intern PIN
export const setInternPin = async (req: Request, res: Response) => {
  const validation = setInternPinSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    await setInternPinService(req.params.id as string, validation.data);

    return res.status(200).json({
      status: "success",
      message: "Intern PIN updated successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Intern not found") {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Set intern PIN error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Verify intern PIN
export const verifyInternPin = async (req: Request, res: Response) => {
  const validation = verifyInternPinSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: validation.error.flatten(),
    });
  }

  try {
    const isValid = await verifyInternPinService(
      req.params.id as string,
      validation.data.pin,
    );

    if (!isValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid PIN",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "PIN verified successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Intern not found") {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }

    if (error instanceof Error && error.message === "Intern PIN not set") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    console.error("Verify intern PIN error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
