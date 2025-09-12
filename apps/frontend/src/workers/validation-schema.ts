import { createErrorMap } from "zod-validation-error/v4";
import { z } from "zod/v4";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});
export const logActivitySchema = z.object({
  userId: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional(),
  metadata: z.any().optional(),
  schoolId: z.string(),
});
