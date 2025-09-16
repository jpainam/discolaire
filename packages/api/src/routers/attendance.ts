import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const attendanceRouter = {
  get: protectedProcedure
    .input(
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
    )
    .query(async ({ ctx, input }) => {
      switch (input.type) {
        case "absence":
          return ctx.db.absence.findUniqueOrThrow({
            where: { id: input.id },
            include: { justification: true, student: true, term: true },
          });
        case "lateness":
          return ctx.db.lateness.findUniqueOrThrow({
            where: { id: input.id },
            include: { justification: true, student: true, term: true },
          });
        case "consigne":
          return ctx.db.consigne.findUniqueOrThrow({
            where: { id: input.id },
            include: { student: true, term: true },
          });
        case "exclusion":
          return ctx.db.exclusion.findUniqueOrThrow({
            where: { id: input.id },
            include: { student: true, term: true },
          });
        case "chatter":
          return ctx.db.chatter.findUniqueOrThrow({
            where: { id: input.id },
            include: { student: true, term: true },
          });
      }
    }),
  delete: protectedProcedure
    .input(
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
    )
    .mutation(async ({ ctx, input }) => {
      switch (input.type) {
        case "absence":
          await ctx.db.absence.delete({
            where: {
              id: input.id,
            },
          });
          break;
        case "lateness":
          await ctx.db.lateness.delete({
            where: {
              id: input.id,
            },
          });
          break;
        case "consigne":
          await ctx.db.consigne.delete({
            where: {
              id: input.id,
            },
          });
          break;
        case "exclusion":
          await ctx.db.exclusion.delete({
            where: {
              id: input.id,
            },
          });
          break;
        case "chatter":
          await ctx.db.chatter.delete({
            where: {
              id: input.id,
            },
          });
          break;
      }
      return true;
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
    .query(async ({ ctx, input }) => {
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
        include: {
          justification: true,
        },
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
      return [
        {
          value: absences
            .reduce((acc, absence) => acc + absence.value, 0)
            .toString(),
          type: "absence",
          justified: absences.reduce(
            (acc, j) => acc + (j.justification?.value ?? 0),
            0,
          ),
        },
        {
          value: latenesses
            .reduce(
              (acc, lateness) => acc + getLatenessValue(lateness.duration),
              0,
            )
            .toString(),
          type: "lateness",
          justified: latenesses.reduce(
            (acc, l) =>
              acc +
              (l.justification ? getLatenessValue(l.justification.value) : 0),
            0,
          ),
        },
        {
          value: consignes.length.toString(),
          type: "consigne",
          justified: 0,
        },
        {
          value: chatters.length.toString(),
          type: "chatter",
          justified: 0,
        },

        {
          value: exclusions.length.toString(),
          type: "exclusion",
          justified: 0,
        },
      ];
    }),

  periodic: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.periodicAttendance.findMany({
        where: {
          studentId: input.studentId,
          termId: input.termId,
        },
      });
    }),
  createPeriodic: protectedProcedure
    .input(
      z.object({
        termId: z.string().min(1),
        attendances: z.array(
          z.object({
            studentId: z.string().min(1),
            absence: z.number().min(0).default(0),
            justifiedAbsence: z.number().min(0).default(0),
            lateness: z.number().default(0),
            justifiedLateness: z.number().min(0).default(0),
            consigne: z.number().min(0).default(0),
            chatter: z.number().min(0).default(0),
          }),
        ),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { termId, attendances } = input;
      const data = [];
      for (const a of attendances) {
        if (
          a.absence != 0 ||
          a.justifiedAbsence != 0 ||
          a.lateness != 0 ||
          a.justifiedLateness != 0 ||
          a.consigne != 0 ||
          a.chatter != 0
        )
          data.push({
            termId,
            studentId: a.studentId,
            absence: a.absence,
            justifiedAbsence: a.justifiedAbsence,
            lateness: a.lateness,
            justifiedLateness: a.justifiedLateness,
            consigne: a.consigne,
            chatter: a.chatter,
            createdById: ctx.session.user.id,
          });
      }
      return ctx.db.periodicAttendance.createMany({
        data: data,
      });
    }),
  // deletePeriodic: protectedProcedure
  //   .input(
  //     z.object({
  //       termId: z.string().min(1),
  //     }),
  //   )
  //   .mutation(({ ctx }) => {}),
  justify: protectedProcedure
    .input(
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
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .mutation(async ({ ctx, input }) => {
      // This mutation is a placeholder for future justification logic.
    }),
} satisfies TRPCRouterRecord;

function getLatenessValue(value: string) {
  if (!value.includes(":")) {
    return parseInt(value);
  }
  const [hours, minutes] = value.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}
