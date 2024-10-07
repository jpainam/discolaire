import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { schoolYearService } from "../services/school-year-service";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const schoolYearRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const schoolYears = await ctx.db.schoolYear.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        startDate: "desc",
      },
    });
    const enrollmentCount = await ctx.db.enrollment.groupBy({
      by: ["schoolYearId"],
      _count: {
        id: true,
      },
    });
    const classroomCount = await ctx.db.classroom.groupBy({
      by: ["schoolYearId"],
      _count: {
        id: true,
      },
    });
    return schoolYears.map((schoolYear) => {
      return {
        ...schoolYear,
        classroom:
          classroomCount.find(
            (classroom) => classroom.schoolYearId === schoolYear.id,
          )?._count.id ?? 0,
        enrollment:
          enrollmentCount.find(
            (enrollment) => enrollment.schoolYearId === schoolYear.id,
          )?._count.id ?? 0,
      };
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        name: z.string(),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.schoolYear.update({
        where: {
          id: input.id,
        },
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          name: input.name,
          isActive: input.isActive,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        name: z.string(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.schoolYear.create({
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          name: input.name,
          schoolId: ctx.schoolId,
          isActive: input.isActive,
        },
      });
    }),
  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.schoolYear.findUnique({
      where: {
        id: input,
      },
    });
  }),
  getDefault: publicProcedure
    .input(z.object({ schoolId: z.string().min(1) }))
    .query(({ input }) => {
      return schoolYearService.getDefault(input.schoolId);
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const hasClassroom = await ctx.db.classroom.count({
        where: {
          schoolYearId: input,
        },
      });
      if (hasClassroom) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete school year with classrooms",
        });
      }
      const hasTerms = await ctx.db.term.count({
        where: {
          schoolYearId: input,
        },
      });
      if (hasTerms) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete school year with terms",
        });
      }
      const hasEnrollment = await ctx.db.enrollment.findFirst({
        where: {
          schoolYearId: input,
        },
      });
      if (hasEnrollment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete school year with enrollments",
        });
      }
      return ctx.db.schoolYear.delete({ where: { id: input } });
    }),
});
