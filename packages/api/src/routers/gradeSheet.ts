import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { protectedProcedure } from "../trpc";

const createGradeSheetSchema = z.object({
  notifyParents: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
  termId: z.string().min(1),
  subjectId: z.coerce.number(),
  weight: z.coerce.number().nonnegative(),
  name: z.string().min(1),
  scale: z.coerce.number().nonnegative(),
  grades: z.array(
    z.object({
      studentId: z.string(),
      absent: z.boolean().default(false),
      grade: z.coerce.number().nonnegative().optional(),
    }),
  ),
});

export const gradeSheetRouter = {
  delete: protectedProcedure
    .input(z.union([z.array(z.coerce.number()), z.coerce.number()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),

  getLatestGradesheet: protectedProcedure
    .input(
      z.object({
        limit: z.coerce.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.findMany({
        where: {
          subject: {
            classroom: {
              schoolId: ctx.schoolId,
              schoolYearId: ctx.schoolYearId,
            },
          },
        },
        include: {
          grades: true,
          subject: {
            include: {
              classroom: true,
              course: true,
            },
          },
          term: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
      });
    }),

  create: protectedProcedure
    .input(createGradeSheetSchema)
    .mutation(async ({ ctx, input }) => {
      // check if the grade sheet already exists
      const gradeExists = await ctx.db.gradeSheet.findMany({
        where: {
          subjectId: input.subjectId,
          termId: input.termId,
        },
      });

      const currentWeight = gradeExists.reduce(
        (acc, grade) => acc + grade.weight,
        0,
      );
      const scaleInputWeight = input.weight / 100.0;
      if (currentWeight + scaleInputWeight > 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Le poids total ne peut pas dépasser 100%. Le total actuel est de ${currentWeight * 100}%.`,
        });
      }
      let errorMessage = "";

      const sheet = await ctx.db.gradeSheet.create({
        data: {
          name: input.name,
          scale: input.scale,
          weight: input.weight / 100.0,
          createdBy: { connect: { id: ctx.session.user.id } },
          subject: { connect: { id: input.subjectId } },
          term: { connect: { id: input.termId } },
        },
      });
      errorMessage = "";
      const grades: Prisma.GradeCreateManyInput[] = input.grades.map(
        (grade) => {
          if (grade.grade && grade.grade > input.scale) {
            errorMessage = `La note ne peut pas dépasser l'échelle de ${input.scale}.`;
          }
          return {
            grade: grade.grade ?? 0,
            studentId: grade.studentId,
            gradeSheetId: sheet.id,
            isAbsent: !grade.grade ? true : grade.absent,
          };
        },
      );
      if (errorMessage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessage,
        });
      }
      await ctx.db.grade.createMany({
        data: grades,
      });
      return sheet;
    }),

  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.db.gradeSheet.findUniqueOrThrow({
      include: {
        grades: {
          include: {
            student: {
              select: {
                gender: true,
              },
            },
          },
        },
        subject: {
          include: {
            course: true,
            teacher: {
              select: {
                id: true,
                lastName: true,
                firstName: true,
              },
            },
          },
        },
        term: true,
      },
      where: {
        id: input,
      },
    });
  }),

  all: protectedProcedure
    .input(
      z
        .object({
          termId: z.string().nullable(),
          subjectId: z.number().nullable(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.findMany({
        where: {
          subject: {
            classroom: {
              schoolId: ctx.schoolId,
              schoolYearId: ctx.schoolYearId,
            },
          },
          ...(input?.termId ? { termId: input.termId } : {}),
          ...(input?.subjectId ? { subjectId: input.subjectId } : {}),
        },
        include: {
          subject: {
            include: {
              course: true,
              teacher: true,
            },
          },
          term: true,
          grades: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  summary: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      const stats = await ctx.db.grade.aggregate({
        _min: { grade: true },
        _max: { grade: true },
        _avg: { grade: true },
        where: {
          gradeSheetId: input,
        },
      });
      return {
        min: stats._min.grade,
        max: stats._max.grade,
        avg: stats._avg.grade,
      };
    }),
  grades: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      const gradeSheet = await ctx.db.gradeSheet.findUniqueOrThrow({
        include: {
          subject: true,
        },
        where: {
          id: input,
        },
      });
      let students = await ctx.services.classroom.getStudents(
        gradeSheet.subject.classroomId,
      );
      if (ctx.session.user.profile === "student") {
        students = students.filter(
          (student) => student.userId === ctx.session.user.id,
        );
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studs = await ctx.services.contact.getStudents(contact.id);
        const studentIds = studs.map((s) => s.studentId);
        students = students.filter((student) =>
          studentIds.includes(student.id),
        );
      }
      const studentIds = students.map((std) => std.id);
      return ctx.db.grade.findMany({
        include: {
          student: {
            include: {
              user: true,
            },
          },
          gradeSheet: {
            include: {
              term: true,
            },
          },
        },
        orderBy: {
          student: {
            lastName: "asc",
          },
        },
        where: {
          studentId: {
            in: studentIds,
          },
          gradeSheetId: input,
        },
      });
    }),
  distribution: protectedProcedure.query(async ({ ctx }) => {
    interface Bucket {
      bin: number;
      count: bigint;
    }

    const raw: Bucket[] = await ctx.db.$queryRaw<Bucket[]>`
        SELECT
          CASE
            WHEN floor((g.grade::numeric / gs.scale::numeric) * 20) < 0 THEN 0
            WHEN floor((g.grade::numeric / gs.scale::numeric) * 20) >= 20 THEN 20
            ELSE floor((g.grade::numeric / gs.scale::numeric) * 20)
          END AS bin,
          COUNT(DISTINCT g."studentId") AS count
        -- COUNT(*) AS count
        FROM "Grade" AS g
        JOIN "GradeSheet" AS gs
          ON g."gradeSheetId" = gs.id
        JOIN "Term" AS t 
          ON gs."termId" = t.id AND t."schoolYearId" = ${ctx.schoolYearId}
        GROUP BY bin
        ORDER BY bin;
      `;

    // Then transform into the shape your chart needs:
    return raw.map((r) => ({
      name: r.bin.toString(),
      value: Number(r.count),
    }));
  }),
  allPercentile: protectedProcedure.query(({ ctx }) => {
    // return gradeSheetService.allPercentile({
    //   schoolYearId: ctx.schoolYearId,
    //   schoolId: ctx.schoolId,
    // });
    return ctx.services.gradesheet.percentileRawQuery({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.schoolId,
    });
  }),
  gradesReportTracker: protectedProcedure.query(({ ctx }) => {
    return ctx.services.gradesheet.gradesReportTracker({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.schoolId,
    });
  }),
  gradeReportTracker: protectedProcedure
    .input(z.object({ subjectId: z.coerce.number() }))
    .query(({ input, ctx }) => {
      return ctx.services.gradesheet.gradeReportTracker({
        subjectId: input.subjectId,
      });
    }),
  updateCreated: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        scale: z.coerce.number().nonnegative(),
        weight: z.coerce.number().nonnegative(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.update({
        where: { id: input.id },
        data: {
          scale: input.scale,
          weight: input.weight / 100.0,
          name: input.title,
        },
      });
    }),
  subjectWeight: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.string().array(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const scales = await ctx.db.gradeSheet.groupBy({
        by: ["subjectId"],
        _sum: { weight: true },
        where: {
          termId: {
            in: input.termId,
          },
          subject: {
            classroomId: input.classroomId,
          },
        },
      });
      return scales.map((s) => {
        return {
          subjectId: s.subjectId,
          weight: s._sum.weight,
        };
      });
    }),
} satisfies TRPCRouterRecord;
