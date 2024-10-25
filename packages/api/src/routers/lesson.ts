import { addDays, endOfMonth, isBefore, isEqual, startOfMonth } from "date-fns";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditLessonSchema = z.object({
  daysOfWeek: z.array(z.coerce.number().nonnegative()),
  startTime: z.coerce.date(),
  subjectId: z.coerce.number().nonnegative(),
  endTime: z.coerce.date(),
});
export const lessonRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEditLessonSchema)
    .mutation(({ ctx, input }) => {
      const data = input.daysOfWeek.map((dayOfWeek) => {
        return {
          subjectId: input.subjectId,
          dayOfWeek: dayOfWeek,
          startTime: input.startTime,
          endTime: input.endTime,
          schoolId: ctx.schoolId,
        };
      });
      return ctx.db.lesson.createMany({
        data: data,
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
          isActive: true,
          subject: {
            classroomId: input.classroomId,
          },
        },
      });

      const events = [];
      for (const lesson of lessons) {
        const weekDates = getWeekdayDatesInMonth(
          input.currentDate,
          lesson.dayOfWeek,
        );
        for (const week of weekDates) {
          const startDate = new Date(week);
          startDate.setHours(lesson.startTime.getHours());
          const endDate = new Date(week);
          endDate.setHours(lesson.endTime.getHours());
          events.push({
            start: startDate,
            end: endDate,
            ...lesson,
          });
        }
      }
      return events;
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lesson.delete({ where: { id: input } });
    }),
});

function getWeekdayDatesInMonth(currentDate: Date, weekday: number): Date[] {
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(startDate);
  let firstWeekdayDate = startDate;
  while (firstWeekdayDate.getDay() !== weekday) {
    firstWeekdayDate = addDays(firstWeekdayDate, 1);
  }

  const dates = [];
  let current = firstWeekdayDate;

  while (isBefore(current, endDate) || isEqual(current, endDate)) {
    dates.push(current);
    current = addDays(current, 7);
  }

  return dates;
}
