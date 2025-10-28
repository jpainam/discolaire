import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, addMonths, subDays, subMonths } from "date-fns";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const subjectTimetableRouter = {
  create: protectedProcedure
    .input(
      z.object({
        start: z.string(),
        end: z.string(),
        subjectId: z.coerce.number(),
        weekday: z.coerce.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectTimetable.create({
        data: {
          start: input.start,
          end: input.end,
          weekday: input.weekday, // 0 = Sun
          validFrom: new Date(),
          subjectId: input.subjectId,
          schoolId: ctx.schoolId,
        },
      });
    }),
  all: protectedProcedure
    .input(
      z.object({
        subjectId: z.coerce.number(),
      }),
    )
    .query(({ ctx, input }) => {
      const today = addDays(new Date(), 1);
      return ctx.db.subjectTimetable.findMany({
        orderBy: [{ weekday: "asc" }, { start: "asc" }],
        where: {
          OR: [{ validTo: null }, { validTo: { gt: today } }],
          subjectId: input.subjectId,
        },
      });
    }),
  clearByClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.subjectTimetable.deleteMany({
        where: {
          subject: {
            classroomId: input.classroomId,
          },
        },
      });
    }),
  byClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        from: z.coerce.date().optional().default(subMonths(new Date(), 4)),
        to: z.coerce.date().optional().default(addMonths(new Date(), 4)),
      }),
    )
    .query(async ({ ctx, input }) => {
      // take -3/+3 month from the currentDate
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
          validFrom: {
            gte: input.from,
          },
          OR: [{ validTo: { lte: input.to } }, { validTo: null }],

          subject: {
            classroomId: input.classroomId,
          },
        },
      });
      return lessons;
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subjectTimetable.update({
        data: {
          validTo: subDays(new Date(), 1),
        },
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
