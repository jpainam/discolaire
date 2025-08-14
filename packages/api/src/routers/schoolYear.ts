import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { schoolYearService } from "../services/school-year-service";
import { protectedProcedure, publicProcedure } from "../trpc";

export const schoolYearRouter = {
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
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.schoolYear.findUniqueOrThrow({
      where: {
        id: ctx.schoolYearId,
      },
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
      const ch = await ctx.db.schoolYear.update({
        where: {
          id: input.id,
        },
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          enrollmentStartDate: input.startDate,
          enrollmentEndDate: input.endDate,
          name: input.name,
          isActive: input.isActive,
        },
      });

      return ch;
    }),
  create: protectedProcedure
    .input(
      z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        name: z.string(),
        isActive: z.boolean().default(true),
        previousSchoolYearId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return schoolYearService.create({
        startDate: input.startDate,
        endDate: input.endDate,
        name: input.name,
        schoolId: ctx.schoolId,
        isActive: input.isActive,
        userId: ctx.session.user.id,
        prevSchoolYearId: input.previousSchoolYearId,
      });
    }),

  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.schoolYear.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
  getDefault: publicProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: input.userId,
        },
      });
      return schoolYearService.getDefault(user.schoolId);
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
          message:
            "On ne peut pas supprimer une année scolaire avec des classes",
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
          message:
            "On ne peut pas supprimer une année scolaire avec des trimestres",
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
          message:
            "On ne peut pas supprimer une année scolaire avec des élèves inscrits",
        });
      }
      return ctx.db.schoolYear.delete({ where: { id: input } });
    }),
  getPrevious: protectedProcedure.query(async ({ ctx }) => {
    const current = await ctx.db.schoolYear.findUniqueOrThrow({
      where: { id: ctx.schoolYearId },
    });

    const previous = await ctx.db.schoolYear.findFirst({
      where: {
        schoolId: current.schoolId,
        startDate: { lt: current.startDate },
      },
      orderBy: { startDate: "desc" },
    });
    if (!previous) {
      return current;
    }
    return previous;
  }),
} satisfies TRPCRouterRecord;
