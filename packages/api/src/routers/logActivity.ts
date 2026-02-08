/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";

import { ActivityType } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const logActivityRouter = {
  create: protectedProcedure
    .input(
      z.object({
        activityType: z.enum(ActivityType),
        action: z.string().min(1),
        entity: z.string().min(1),
        entityId: z.string().optional(),
        data: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.pubsub.log({
        activityType: input.activityType,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        data: input.data,
      });
    }),
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
        schoolId: ctx.schoolId,
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
        activityType: z.enum(ActivityType).optional(),
        action: z.string().optional(),
        entity: z.string().optional(),
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
          ...(input.activityType ? { activityType: input.activityType } : {}),
          ...(input.action ? { action: input.action } : {}),
          ...(input.entity ? { entity: input.entity } : {}),
          ...(input.userId ? { userId: input.userId } : {}),
          ...(input.from ? { createdAt: { gte: input.from } } : {}),
          ...(input.to ? { createdAt: { lte: input.to } } : {}),
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
