import { z } from "zod";

export const classroomLevelSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const classroomLevelsSchema = z.array(classroomLevelSchema);
export type ClassroomLevel = z.infer<typeof classroomLevelSchema>;
