import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, addMonths, subMonths } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

const createEditLessonSchema = z.object({
  start: z.coerce.date(),
  categoryId: z.string().min(1),
  isRepeating: z.boolean().default(false),
  subjectId: z.coerce.number().nonnegative(),
  end: z.coerce.date(),
  startDate: z.coerce.date(),
});
export const subjectTimetableRouter = {
  create: protectedProcedure
    .input(createEditLessonSchema)
    .mutation(async ({ ctx, input }) => {
      const schoolYear = await ctx.db.schoolYear.findUnique({
        where: {
          id: ctx.schoolYearId,
        },
      });
      const endDate = schoolYear?.endDate ?? addMonths(new Date(), 9);
      const groupKey = uuidv4();
      const event = {
        start: input.start,
        end: input.end,
        groupKey: groupKey,
        subjectId: input.subjectId,
        categoryId: input.categoryId,
        schoolId: ctx.schoolId,
      };
      const events = [event];
      let currentDate = input.start;
      if (input.isRepeating) {
        while (currentDate <= endDate) {
          const newEvent = { ...event };
          newEvent.start = addDays(event.start, 7);
          newEvent.end = addDays(event.end, 7);
          events.push(newEvent);
          currentDate = addDays(currentDate, 7);
        }
      }
      return ctx.db.subjectTimetable.createMany({
        data: events,
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
          start: {
            gte: input.from,
          },
          end: {
            lte: input.to,
          },
          subject: {
            classroomId: input.classroomId,
          },
        },
      });
      return lessons;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        type: z.enum(["current", "before", "after"]).default("current"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "current") {
        return ctx.db.subjectTimetable.delete({
          where: {
            id: input.id,
          },
        });
      }
      const event = await ctx.db.subjectTimetable.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return ctx.db.subjectTimetable.deleteMany({
        where: {
          groupKey: event.groupKey,
          ...(input.type == "before"
            ? {
                start: {
                  lte: event.start,
                },
              }
            : {
                start: {
                  gt: event.start,
                },
              }),
        },
      });
    }),
} satisfies TRPCRouterRecord;
