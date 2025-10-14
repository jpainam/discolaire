import { z } from "zod/v4";

export const smsTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  content: z.string(),
  isActive: z.coerce.boolean(),
  createdAt: z.coerce.date(),
});

export type SMSTemplate = z.infer<typeof smsTemplateSchema>;
export const smsTemplatesSchema = z.array(smsTemplateSchema);

export const smsHistorySchema = z.object({
  id: z.number(),
  message: z.string(),
  status: z.string(),
  createdAt: z.coerce.date(),
  sentAt: z.coerce.date().nullable(),
});

export type SMSHistory = z.infer<typeof smsHistorySchema>;
