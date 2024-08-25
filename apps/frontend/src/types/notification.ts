import { z } from "zod";

export const notificationSchema = z.object({
  id: z.number(),
  title: z.string().nullish(),
  content: z.string().nullish(),
  createdAt: z.coerce.date().nullish(),
  status: z.enum(["read", "unread"]).nullish(),
});

export const notifiationListSchema = z.array(notificationSchema);
export type Notification = z.infer<typeof notificationSchema>;
