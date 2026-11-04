import { type Request, type Response, type NextFunction } from "express";
import { type ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: result.error.issues.map((i) => ({
          field: i.path.join("."), // e.g. "query.page"
          message: i.message,
        })),
      });
    }

    res.locals.validated = result.data;
    next();
  };
