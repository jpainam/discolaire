import { z } from "zod";

export const gradeSheetSchema = z.object({
  id: z.number(),
  name: z.string(),
  startDate: z.coerce.date().nullish(),
  endDate: z.coerce.date().nullish(),
  createdAt: z.coerce.date().nullish(),
  isActive: z.boolean().nullish(),
  weight: z.number().nullish(),
  observation: z.string().nullish(),
  subjectId: z.number(),
  termId: z.number(),
  term: z
    .object({
      id: z.number(),
      name: z.string(),
      order: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      schoolYearId: z.string(),
      createdAt: z.coerce.date().nullish(),
      updatedAt: z.coerce.date().nullish(),
      observation: z.string().nullish(),
      isActive: z.boolean().nullish(),
    })
    .nullish(),
  subject: z.any().nullish(),
  avg: z.number().nullish(),
  max: z.number().nullish(),
  min: z.number().nullish(),
  num_grades: z.number().nullish(),
  num_is_absent: z.number().nullish(),
});

export const gradeSheetListSchema = z.array(gradeSheetSchema);

export type GradeSheet = z.infer<typeof gradeSheetSchema>;
