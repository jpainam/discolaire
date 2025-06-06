import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { messagingService } from "../services/messaging-service";
import { protectedProcedure } from "../trpc";

export const messagingRouter = {
  sendEmail: protectedProcedure
    .input(
      z.object({
        subject: z.string(),
        body: z.string(),
        receipt: z.boolean().optional().default(false),
        schedule: z
          .enum(["now", "end-of-day", "tomorrow", "custom"])
          .optional()
          .default("now"),
        to: z.union([z.string(), z.array(z.string())]),
      }),
    )
    .mutation(({ input }) => {
      return messagingService.sendEmail({
        body: input.body,
        receipt: input.receipt,
        schedule: input.schedule,
        subject: input.subject,
        to: input.to,
      });
    }),
} satisfies TRPCRouterRecord;
