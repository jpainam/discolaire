import type { TRPCRouterRecord } from "@trpc/server";
import * as z from "zod";

import { NotificationSourceType } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  getStatuses: protectedProcedure
    .input(
      z.object({
        sourceType: z.enum(NotificationSourceType),
        sourceIds: z.string().array(),
        recipientId: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.services.notification.getStatuses({
        sourceIds: input.sourceIds,
        sourceType: input.sourceType,
        schoolId: ctx.schoolId,
      });
    }),
  // notify: protectedProcedure
  //   .input(
  //     z.object({
  //       sourceId: z.string().min(1),
  //       sourceType: z.enum(NotificationSourceType),
  //     }),
  //   )
  //   .mutation(({ ctx, input }) => {
  //       return ctx.d
  //   }),
} satisfies TRPCRouterRecord;
