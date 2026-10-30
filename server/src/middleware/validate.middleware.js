import {} from "express";
import {} from "zod";
export const validate = (schema) => (req, res, next) => {
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
//# sourceMappingURL=validate.middleware.js.map