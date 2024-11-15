import { z } from "zod";

export const reportQueueSchema = z.object({
  id: z.number(),
  name: z.string().nullish(),
  code: z.string().nullish(),
  signedUrl: z.string().nullish(),
  //content: z.record(z.string(), z.any()).nullish(),
  content: z.any().nullish(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELED", "FAILED"]).nullish(),
  expectedDate: z.coerce.date().nullish(),
  createdAt: z.coerce.date().nullish(),
  startedAt: z.coerce.date().nullish(),
  completedAt: z.coerce.date().nullish(),
  userId: z.string().nullish(),
});

export const reportQueueListSchema = z.array(reportQueueSchema);
export type ReportQueue = z.infer<typeof reportQueueSchema>;

export const reportSchema = z.object({
  id: z.number(),
  code: z.string(),
  category: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  type: z.enum(["pdf", "excel", "csv"]),
  link: z.string(),
  createdAt: z.coerce.date(),
});

export const reportsSchema = z.array(reportSchema);
export type Report = z.infer<typeof reportSchema>;
