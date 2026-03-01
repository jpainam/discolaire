import type { TRPCRouterRecord } from "@trpc/server";
import * as z from "zod";

import { protectedProcedure } from "../trpc";

export const notificationCategoryRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.notificationCategory.findMany({
      where: { schoolId: ctx.schoolId },
      orderBy: { order: "asc" },
      include: { _count: { select: { configs: true } } },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        key: z.string().min(1),
        label: z.string().min(1),
        order: z.number().int().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notificationCategory.create({
        data: {
          schoolId: ctx.schoolId,
          ...input,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        key: z.string().min(1).optional(),
        label: z.string().min(1).optional(),
        order: z.number().int().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;
      return ctx.db.notificationCategory.update({
        where: { id },
        data: fields,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notificationCategory.delete({
        where: { id: input.id },
      });
    }),
} satisfies TRPCRouterRecord;
