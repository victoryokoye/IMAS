import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.body.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (error) {
    res.status(401);
  }
};

export default authMiddleware;
