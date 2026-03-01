import type { TRPCRouterRecord } from "@trpc/server";
import z from "zod";

import { ActivityAction, ActivityTargetType } from "../activity-logger";
import { protectedProcedure } from "../trpc";

export const logActivityRouter = {
  create: protectedProcedure
    .input(
      z.object({
        action: z.nativeEnum(ActivityAction),
        targetType: z.nativeEnum(ActivityTargetType),
        targetId: z.string().optional(),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      ctx.activityLog.log({
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        description: input.description,
      });
    }),

  user: protectedProcedure.input(z.string().min(1)).query(({ input, ctx }) => {
    return ctx.db.logActivity.findMany({
      take: 100,
      include: {
        user: { select: { id: true, name: true } },
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

  all: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        limit: z.number().optional().default(100),
        userId: z.string().optional(),
        targetType: z.enum(["staff", "student", "contact"]).optional(),
        action: z.string().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        take: input.limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
        },
        where: {
          schoolId: ctx.schoolId,
          ...(input.userId ? { userId: input.userId } : {}),
          ...(input.targetType ? { targetType: input.targetType } : {}),
          ...(input.action ? { action: input.action } : {}),
          ...(input.from || input.to
            ? {
                createdAt: {
                  ...(input.from ? { gte: input.from } : {}),
                  ...(input.to ? { lte: input.to } : {}),
                },
              }
            : {}),
          ...(input.query
            ? {
                OR: [
                  { action: { contains: input.query, mode: "insensitive" } },
                  {
                    description: {
                      contains: input.query,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
      });
    }),

  search: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        action: z.string().optional(),
        targetType: z.string().optional(),
        userId: z.string().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        limit: z.coerce.number().optional().default(20),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit,
        include: {
          user: { select: { id: true, name: true } },
        },
        where: {
          schoolId: ctx.schoolId,
          ...(input.action ? { action: input.action } : {}),
          ...(input.targetType ? { targetType: input.targetType } : {}),
          ...(input.userId ? { userId: input.userId } : {}),
          ...(input.from ? { createdAt: { gte: input.from } } : {}),
          ...(input.to ? { createdAt: { lte: input.to } } : {}),
          ...(input.query
            ? {
                description: { contains: input.query, mode: "insensitive" },
              }
            : {}),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.logActivity.delete({ where: { id: input } });
    }),

  findByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        where: { userId: input.userId, schoolId: ctx.schoolId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      });
    }),
} satisfies TRPCRouterRecord;
