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
} satisfies TRPCRouterRecord;
