import { z } from "zod";

export const dashboardSummarySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).strict(),
  params: z.object({}).optional(),
});
