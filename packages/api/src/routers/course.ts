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
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.course.findUniqueOrThrow({
      where: {
        id: input,
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
  used: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
        subjects: {
          some: {
            classroom: {
              schoolId: ctx.schoolId,
              schoolYearId: ctx.schoolYearId,
            },
          },
        },
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
  statistics: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        termId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.gradeSheet.findMany({
        where: {
          termId: input.termId,
          subject: {
            courseId: input.id,
          },
        },
        include: {
          term: {
            select: {
              name: true,
            },
          },
          subject: {
            include: {
              teacher: {
                select: {
                  lastName: true,
                  firstName: true,
                },
              },
              classroom: {
                select: {
                  reportName: true,
                  level: true,
                },
              },
            },
          },
          grades: {
            select: {
              grade: true,
              isAbsent: true,
              student: {
                select: {
                  gender: true,
                },
              },
            },
          },
        },
      });
      return result
        .map((sheet) => {
          const grades = sheet.grades.filter((g) => !g.isAbsent);
          const max = Math.max(...grades.map((g) => g.grade));
          const min = Math.min(...grades.map((g) => g.grade));
          const boys = grades.filter((g) => g.student.gender === "male");
          const girls = grades.filter((g) => g.student.gender === "female");
          const boysAbove10 = boys.filter((g) => g.grade >= 10).length;
          const girlsAbove10 = girls.filter((g) => g.grade >= 10).length;
          const boysRate = boys.length == 0 ? 0 : boysAbove10 / boys.length;
          const girlsRate = girls.length == 0 ? 0 : girlsAbove10 / girls.length;

          const above10 = grades.filter((g) => g.grade >= 10).length;
          const totalRate = grades.length == 0 ? 0 : above10 / grades.length;

          const avg =
            grades.length == 0
              ? 0
              : grades.map((g) => g.grade).reduce((a, b) => a + b, 0) /
                grades.length;

          return {
            max: max,
            min: min,
            avg: avg,
            evaluated: grades.length,
            totalRate: totalRate,
            above10: above10,
            boysRate: boysRate,
            girlsRate: girlsRate,
            total: sheet.grades.length,
            classroom: sheet.subject.classroom,
            order: sheet.subject.classroom.level.order,
            term: sheet.term,
            teacher: sheet.subject.teacher,
          };
        })
        .sort((a, b) => {
          return a.order - b.order;
        });
    }),
} satisfies TRPCRouterRecord;
