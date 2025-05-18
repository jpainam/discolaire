import type { TRPCRouterRecord } from "@trpc/server";
import { subHours } from "date-fns";
import { z } from "zod";

import type { Prisma } from "@repo/db";

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
              title: {
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

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
        description: z.string().optional(),
        entityId: z.string().optional(),
        entityType: z.string().optional(),
        type: z.enum(["CREATE", "UPDATE", "DELETE", "READ"]).default("READ"),
        data: z.any().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const oneHourAgo = subHours(new Date(), 1);
      const recentLog = await ctx.db.logActivity.findFirst({
        where: {
          userId: ctx.session.user.id,
          url: input.url,
          createdAt: {
            gte: oneHourAgo,
          },
        },
      });
      if (!recentLog) {
        return ctx.db.logActivity.create({
          data: {
            title: input.title,
            url: input.url,
            description: input.description,
            entityId: input.entityId,
            entityType: input.entityType,
            data: input.data as Prisma.JsonObject,
            userId: ctx.session.user.id,
            schoolYearId: ctx.schoolYearId,
            schoolId: ctx.schoolId,
          },
        });
      }
    }),

  findByEntityId: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(["student", "staff", "classroom"]),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        where: {
          entityId: input.entityId,
          entityType: input.entityType,
          schoolYearId: ctx.schoolYearId,
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
