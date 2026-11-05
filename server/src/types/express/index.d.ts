declare global {
  namespace Express {
    interface User {
      id: string;
      role: "ADMINISTRATOR" | "SUPERVISOR" | "INTERN_COORDINATOR";
    }

    interface Request {
      user?: User;
    }
  }
}

export type SortOrder = "asc" | "desc";

export {};
