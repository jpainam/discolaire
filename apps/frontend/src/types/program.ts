import { z } from "zod";

const programDocumentSchema = z.object({
  id: z.number(),
  title: z.string().nullish(),
  documentUrl: z.string().nullish(),
  description: z.string().nullish(),
  isActive: z.boolean(),
  programId: z.number(),
});
const programCategorySchema = z.object({});
export const programThemeSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  schoolYearId: z.string(),
  courseId: z.string().nullish(),
  course: z.any().nullish(),
});
export const programThemeListSchema = z.array(programThemeSchema);
export const programSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullish(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullish(),
  status: z.string().nullish(),
  isActive: z.boolean(),
  documents: z.array(programDocumentSchema).nullish(),
  category: programCategorySchema.nullish(),
  categoryId: z.number().nullish(),
  themeId: z.number().nullish(),
  theme: programThemeSchema.nullish(),
});

export type Program = z.infer<typeof programSchema>;
export type ProgramTheme = z.infer<typeof programThemeSchema>;
export const programListSchema = z.array(programSchema);
