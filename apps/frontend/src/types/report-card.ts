import { z } from "zod/v4";

export const reportCardSchema = z.object({
  studentId: z.string(),
  termId: z.string(),
  classroomId: z.string(),
  remark: z.string().nullish(),
  remarkBy: z.string().nullish(),
  remarkAt: z.coerce.date(), //z.coerce.date(),
});

export type ReportCardType = z.infer<typeof reportCardSchema>;

export const reportCardListSchema = z.array(reportCardSchema);

export const studentReportCard = z.object({
  avg: z.number().nullish(),
  rank: z.number(),

  isAbsent: z.boolean(),
  num_grades: z.number(),
  classroom: z.object({
    max: z.number(),
    min: z.number(),
    avg: z.number(),
  }),
});

//export type StudentReportCard = z.infer<typeof studentReportCard>;
