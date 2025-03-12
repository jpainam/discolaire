import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateStringColor } from "../utils";

export const courseRouter = createTRPCRouter({
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
          color: generateStringColor(),
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
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.update({
        where: {
          id: input.id,
        },
        data: {
          shortName: input.shortName,
          name: input.name,
          reportName: input.reportName,
          isActive: input.isActive,
        },
      });
    }),
});
