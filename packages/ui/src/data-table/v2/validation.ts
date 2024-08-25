import { z } from "zod";

export const tableSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  q: z.string().optional(),
  cycleId: z.string().optional(),
  levelId: z.string().optional(),
  sectionId: z.string().optional(),
  date: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export type TableSearchParams = z.infer<typeof tableSearchParamsSchema>;
