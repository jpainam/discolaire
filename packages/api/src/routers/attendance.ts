import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const attendanceRouter = {
  delete: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.coerce.number(),
          type: z.enum([
            "absence",
            "lateness",
            "consigne",
            "exclusion",
            "chatter",
          ]),
        }),
      ),
    )
    .mutation(({ ctx, input }) => {
      return input.map(async (attend) => {
        switch (attend.type) {
          case "absence":
            await ctx.db.absence.delete({
              where: {
                id: attend.id,
              },
            });
            break;
          case "lateness":
            await ctx.db.lateness.delete({
              where: {
                id: attend.id,
              },
            });
            break;
          case "consigne":
            await ctx.db.consigne.delete({
              where: {
                id: attend.id,
              },
            });
            break;
          case "exclusion":
            await ctx.db.exclusion.delete({
              where: {
                id: attend.id,
              },
            });
            break;
          case "chatter":
            await ctx.db.chatter.delete({
              where: {
                id: attend.id,
              },
            });
            break;
        }
        return true;
      });
    }),
  deletePeriodic: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return Promise.all([
        ctx.db.absence.deleteMany({
          where: {
            student: {
              enrollments: {
                some: {
                  classroomId: input.classroomId,
                },
              },
            },
            termId: input.termId,
          },
        }),
        ctx.db.lateness.deleteMany({
          where: {
            student: {
              enrollments: {
                some: {
                  classroomId: input.classroomId,
                },
              },
            },
            termId: input.termId,
          },
        }),
        ctx.db.consigne.deleteMany({
          where: {
            student: {
              enrollments: {
                some: {
                  classroomId: input.classroomId,
                },
              },
            },
            termId: input.termId,
          },
        }),
        ctx.db.exclusion.deleteMany({
          where: {
            student: {
              enrollments: {
                some: {
                  classroomId: input.classroomId,
                },
              },
            },
            termId: input.termId,
          },
        }),
        ctx.db.chatter.deleteMany({
          where: {
            student: {
              enrollments: {
                some: {
                  classroomId: input.classroomId,
                },
              },
            },
            termId: input.termId,
          },
        }),
      ]);
    }),
  studentSummary: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const termIds = input.termId
        ? [input.termId]
        : await ctx.db.term
            .findMany({
              where: {
                schoolId: ctx.schoolId,
                schoolYearId: ctx.schoolYearId,
              },
              select: {
                id: true,
              },
            })
            .then((terms) => terms.map((term) => term.id));
      const absences = await ctx.db.absence.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: input.studentId,

          termId: {
            in: termIds,
          },
        },
      });
      const chatters = await ctx.db.chatter.findMany({
        where: {
          studentId: input.studentId,
          termId: {
            in: termIds,
          },
        },
      });
      const latenesses = await ctx.db.lateness.findMany({
        where: {
          studentId: input.studentId,
          termId: { in: termIds },
        },
      });
      const exclusions = await ctx.db.exclusion.findMany({
        where: {
          studentId: input.studentId,
          termId: { in: termIds },
        },
      });
      const consignes = await ctx.db.consigne.findMany({
        where: {
          studentId: input.studentId,
          termId: { in: termIds },
        },
      });
    }),
} satisfies TRPCRouterRecord;
