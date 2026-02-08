import { z } from "zod/v4";

export const logActivitySchema = z.object({
  userId: z.string(),
  activityType: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional(),
  data: z.any().optional(),
  schoolId: z.string(),
});
