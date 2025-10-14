import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  startTime: z.object({
    hour: z.number(),
    minute: z.number(),
  }),
  endDate: z.coerce.date(),
  endTime: z.object({
    hour: z.number(),
    minute: z.number(),
  }),
  variant: z.enum(["blue", "green", "red", "yellow", "purple", "gray"], {
    required_error: "Variant is required",
  }),
});

export type TEventFormData = z.infer<typeof eventSchema>;
