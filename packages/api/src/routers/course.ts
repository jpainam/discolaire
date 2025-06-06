import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";
import { generateStringColor } from "../utils";

export const courseRouter = {
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.delete({
        where: { schoolId: ctx.schoolId, id: input },
      });
    }),
  deleteMany: protectedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.deleteMany({
        where: {
          schoolId: ctx.schoolId,
          id: {
            in: input,
          },
        },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.course.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        shortName: z.string().min(1),
        reportName: z.string().min(1),
        color: z.string().optional().default(""),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.create({
        data: {
          shortName: input.shortName,
          name: input.name,
          reportName: input.reportName,
          isActive: input.isActive,
          schoolId: ctx.schoolId,
          color: input.color ? input.color : generateStringColor(),
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        shortName: z.string().min(1),
        reportName: z.string().min(1),
        color: z.string().optional().default(""),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.db.course.findUniqueOrThrow({
        where: {
          id: input.id,
          schoolId: ctx.schoolId,
        },
      });
      return ctx.db.course.update({
        where: {
          id: input.id,
        },
        data: {
          shortName: input.shortName,
          name: input.name,
          reportName: input.reportName,
          isActive: input.isActive,
          color: input.color ? input.color : course.color,
        },
      });
    }),
} satisfies TRPCRouterRecord;
