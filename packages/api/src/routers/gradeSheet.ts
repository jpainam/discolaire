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
    const sheets = await ctx.db.gradeSheet.findMany({
      where: {
        term: {
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      },
      select: { scale: true, grades: true },
    });

    // 2. Build a 0–20 counter on the server:
    const counts: Record<number, number> = {};
    for (let i = 0; i <= 20; i++) counts[i] = 0;

    for (const { scale, grades } of sheets) {
      for (const { grade } of grades) {
        let scaled = (grade / scale) * 20;
        if (scaled < 0) scaled = 0;
        if (scaled > 20) scaled = 20;
        const bin = scaled === 20 ? 20 : Math.floor(scaled);
        const valBin = counts[bin] ?? 0;
        counts[bin] = valBin + 1;
      }
    }

    // 3. Turn it into the array your client expects:
    return Object.entries(counts)
      .map(([key, val]) => ({
        name: key,
        value: val,
      }))
      .sort((a, b) => Number(a.name) - Number(b.name));
  }),
});
