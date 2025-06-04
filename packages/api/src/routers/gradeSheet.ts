import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Prisma } from "@repo/db";

import { gradeSheetService } from "../services/gradesheet-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createGradeSheetSchema = z.object({
  notifyParents: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
  termId: z.coerce.number(),
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

export const gradeSheetRouter = createTRPCRouter({
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
      let errorMessage = "";
      gradeExists.forEach((grade) => {
        if (grade.weight == 100 && input.weight == 100) {
          errorMessage = "Grade with 100% weight already exists";
        }
      });
      if (errorMessage) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessage,
        });
      }
      // Update previous grade weight to sum to remaining weight
      const remainingWeight = 100 - input.weight;
      await Promise.all(
        gradeExists.map(async (grade) => {
          return ctx.db.gradeSheet.update({
            data: {
              weight: grade.weight * (remainingWeight / 100),
            },
            where: {
              id: grade.id,
            },
          });
        }),
      );
      const sheet = await ctx.db.gradeSheet.create({
        data: {
          name: input.name,
          scale: input.scale,
          weight: input.weight,
          createdBy: { connect: { id: ctx.session.user.id } },
          subject: { connect: { id: input.subjectId } },
          term: { connect: { id: input.termId } },
        },
      });
      errorMessage = "";
      const grades: Prisma.GradeCreateManyInput[] = input.grades.map(
        (grade) => {
          if (grade.grade && grade.grade > input.scale) {
            errorMessage = "Grade cannot be greater than scale";
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
  successRate: protectedProcedure.input(z.number()).query(async ({ input }) => {
    return gradeSheetService.sucessRate(input);
  }),
  all: protectedProcedure.query(async ({ ctx }) => {
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
  grades: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
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
        GROUP BY bin
        ORDER BY bin;
      `;

    // Then transform into the shape your chart needs:
    return raw.map((r) => ({
      name: r.bin.toString(),
      value: Number(r.count),
    }));
    // const allGrades = await ctx.db.grade.findMany({
    //   select: {
    //     studentId: true,
    //     grade: true,
    //     gradeSheet: { select: { scale: true } },
    //   },
    // });

    // // 2. Build a Set for each bin [0..20] to track unique studentIds.
    // const studentSets: Record<number, Set<string>> = {};
    // for (let i = 0; i <= 20; i++) {
    //   studentSets[i] = new Set();
    // }

    // // 3. Loop over each grade-record, compute its “scaled bin”, then add studentId to that Set.
    // for (const { studentId, grade, gradeSheet } of allGrades) {
    //   const scale = gradeSheet.scale;
    //   let scaled = (grade / scale) * 20;
    //   if (scaled < 0) scaled = 0;
    //   if (scaled > 20) scaled = 20;
    //   const bin = scaled === 20 ? 20 : Math.floor(scaled);

    //   studentSets[bin].add(studentId);
    // }

    // // 4. Transform each Set into its size, producing an array of { name, value } sorted by bin.
    // const chartData = Object.entries(studentSets)
    //   .map(([key, set]) => ({
    //     name: key, // “0”, “1”, …, “20”
    //     value: set.size, // number of distinct students in that bin
    //   }))
    //   .sort((a, b) => Number(a.name) - Number(b.name));
  }),
  allPercentile: protectedProcedure.query(({ ctx }) => {
    // return gradeSheetService.allPercentile({
    //   schoolYearId: ctx.schoolYearId,
    //   schoolId: ctx.schoolId,
    // });
    return gradeSheetService.percentileRawQuery({
      schoolYearId: ctx.schoolYearId,
      schoolId: ctx.schoolId,
    });
  }),
});
