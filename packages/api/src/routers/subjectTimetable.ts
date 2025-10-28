import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const timeRegex = /^\d{2}:\d{2}$/;

export const subjectTimetableRouter = {
  create: protectedProcedure
    .input(
      z.object({
        start: z.string().regex(timeRegex),
        end: z.string().regex(timeRegex),
        subjectId: z.coerce.number(),
        weekdays: z.coerce.number().int().min(0).max(6).array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await Promise.all(
        input.weekdays.map((weekday) => {
          return ctx.db.subjectTimetable.upsert({
            where: {
              subjectId_weekday_start_end: {
                subjectId: input.subjectId,
                weekday,
                start: input.start,
                end: input.end,
              },
            },
            update: {
              validFrom: new Date(),
              validTo: null,
            },
            create: {
              start: input.start,
              end: input.end,
              weekday,
              validFrom: new Date(),
              subjectId: input.subjectId,
              createdById: ctx.session.user.id,
            },
          });
        }),
      );
    }),

  // "what's active right now" for a given subject
  all: protectedProcedure
    .input(
      z.object({
        subjectId: z.coerce.number(),
        at: z.coerce.date().optional(), // allow checking past state too
      }),
    )
    .query(({ ctx, input }) => {
      const targetDate = input.at ?? new Date();

      return ctx.db.subjectTimetable.findMany({
        orderBy: [{ weekday: "asc" }, { start: "asc" }],
        where: {
          subjectId: input.subjectId,
          validFrom: { lte: targetDate },
          OR: [{ validTo: null }, { validTo: { gt: targetDate } }],
        },
      });
    }),

  // "close" every active row in a classroom going forward
  clearByClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const now = new Date();

      return ctx.db.subjectTimetable.updateMany({
        data: {
          validTo: now,
        },
        where: {
          subject: {
            classroomId: input.classroomId,
          },
          OR: [{ validTo: null }, { validTo: { gt: now } }],
        },
      });
    }),

  // "get all lessons that overlap a window"
  byClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const schoolYear = await ctx.db.schoolYear.findUniqueOrThrow({
        where: { id: ctx.schoolYearId },
      });
      const start = input.from ?? schoolYear.startDate;
      const end = input.to ?? schoolYear.endDate;
      const lessons = await ctx.db.subjectTimetable.findMany({
        include: {
          subject: {
            include: {
              teacher: true,
              course: true,
            },
          },
        },
        where: {
          subject: {
            classroomId: input.classroomId,
          },
          validFrom: { lt: end },
          OR: [{ validTo: null }, { validTo: { gt: start } }],
        },
        orderBy: [{ weekday: "asc" }, { start: "asc" }],
      });

      return lessons;
    }),

  // soft delete one entry
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectTimetable.update({
        data: {
          validTo: new Date(), // stop being active now
        },
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
