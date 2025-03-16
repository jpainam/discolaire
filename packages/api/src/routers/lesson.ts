import { addMonths } from "date-fns";
import { z } from "zod";

import { timetableService } from "../services/timetable-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditLessonSchema = z.object({
  daysOfWeek: z.array(z.string()).default([]),
  startTime: z.string().min(1),
  subjectId: z.coerce.number().nonnegative(),
  endTime: z.string().min(1),
  startDate: z.coerce.date(),
});
export const lessonRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEditLessonSchema)
    .mutation(async ({ ctx, input }) => {
      const schoolYear = await ctx.db.schoolYear.findUnique({
        where: {
          id: ctx.schoolYearId,
        },
      });
      const events = timetableService.generateRange({
        startDate: input.startDate,
        startTime: input.startTime,
        endTime: input.endTime,
        daysOfWeek: input.daysOfWeek,
        finalDate: schoolYear?.endDate ?? addMonths(new Date(), 9),
      });
      const data = events.map((event) => {
        return {
          subjectId: input.subjectId,
          startTime: event.start,
          endTime: event.end,
          schoolId: ctx.schoolId,
          createdById: ctx.session.user.id,
        };
      });
      return ctx.db.lesson.createMany({
        data: data,
      });
    }),
  clearByClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.lesson.deleteMany({
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
        currentDate: z.coerce.date().default(new Date()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const lessons = await ctx.db.lesson.findMany({
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
        },
      });

      const events = [];
      for (const lesson of lessons) {
        events.push({
          start: lesson.startTime,
          end: lesson.endTime,
          ...lesson,
        });
      }
      return events;
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lesson.delete({ where: { id: input } });
    }),
});

// function getWeekdayDatesInMonth(currentDate: Date, weekday: number): Date[] {
//   const startDate = startOfMonth(currentDate);
//   const endDate = endOfMonth(startDate);
//   let firstWeekdayDate = startDate;
//   while (firstWeekdayDate.getDay() !== weekday) {
//     firstWeekdayDate = addDays(firstWeekdayDate, 1);
//   }

//   const dates = [];
//   let current = firstWeekdayDate;

//   while (isBefore(current, endDate) || isEqual(current, endDate)) {
//     dates.push(current);
//     current = addDays(current, 7);
//   }

//   return dates;
// }
