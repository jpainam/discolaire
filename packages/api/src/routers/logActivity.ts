import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const logActivityRouter = {
  user: protectedProcedure.input(z.string().min(1)).query(({ input, ctx }) => {
    return ctx.db.logActivity.findMany({
      take: 100,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: input,
      },
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.logActivity.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
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
      console.log("Searching log activities with query:", q);
      return ctx.db.logActivity.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        include: {
          user: true,
        },
        where: {
          schoolId: ctx.schoolId,
          // OR: [
          //   {
          //     title: {
          //       contains: q,
          //       mode: "insensitive",
          //     },
          //     ...(input.eventType ? { eventType: input.eventType } : {}),
          //     ...(input.source ? { source: input.source } : {}),
          //     ...(input.userId ? { userId: input.userId } : {}),
          //     ...(input.from ? { createdAt: { gte: input.from } } : {}),
          //     ...(input.to ? { createdAt: { lte: input.to } } : {}),
          //   },
          // ],
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

  findByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        where: {
          userId: input.userId,
          schoolId: ctx.schoolId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
} satisfies TRPCRouterRecord;
