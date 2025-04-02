import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const logActivityRouter = {
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        eventType: z.enum(["CREATE", "UPDATE", "DELETE", "READ"]).optional(),
        source: z.string().optional(),
        userId: z.string().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        limit: z.coerce.number().optional().default(20),
      }),
    )
    .query(({ ctx, input }) => {
      const q = `%${input.query}%`;
      return ctx.db.logActivity.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          user: true,
        },
        where: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
          OR: [
            {
              event: {
                contains: q,
                mode: "insensitive",
              },
              ...(input.eventType ? { eventType: input.eventType } : {}),
              ...(input.source ? { source: input.source } : {}),
              ...(input.userId ? { userId: input.userId } : {}),
              ...(input.from ? { createdAt: { gte: input.from } } : {}),
              ...(input.to ? { createdAt: { lte: input.to } } : {}),
            },
          ],
        },
      });
    }),

  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.logActivity.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
