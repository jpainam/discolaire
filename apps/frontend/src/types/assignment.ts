import { z } from "zod";

export const assignmentCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
});

export const assignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  isActive: z.boolean(),
  visibleFrom: z.coerce.date(),
  visibleTo: z.coerce.date(),
  createdAt: z.coerce.date().nullish(),
  visibleToStudents: z.coerce.boolean(),
  visibleToParents: z.coerce.boolean(),
  link: z.string().nullish(),
  attachments: z.array(z.string()).nullish(),
  sections: z.array(z.string()).nullish(),
  postToCalendar: z.boolean(),
  sendEmailNotification: z.boolean(),
  sendSMSNotification: z.boolean(),
  classroomId: z.string(),
  subjectId: z.number(),
  subject: z.any(),
  category: assignmentCategorySchema.nullish(),
});

export const assignmentListSchema = z.array(assignmentSchema);

export type Assignment = z.infer<typeof assignmentSchema>;
export type AssignmentCategory = z.infer<typeof assignmentCategorySchema>;
