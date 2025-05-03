import { addMonths, getDay, subMonths } from "date-fns";
import { z } from "zod";

import { timetableService } from "../services/timetable-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditLessonSchema = z.object({
  dayOfWeek: z.coerce.number(),
  startTime: z.string().min(1),
  categoryId: z.string().min(1),
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
        dayOfWeek: input.dayOfWeek,
        finalDate: schoolYear?.endDate ?? addMonths(new Date(), 9),
      });
      const data = events.map((event) => {
        return {
          subjectId: input.subjectId,
          startTime: event.start,
          categoryId: input.categoryId,
          endTime: event.end,
          schoolId: ctx.schoolId,
          //createdById: ctx.session.user.id,
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
        from: z.coerce.date().optional().default(subMonths(new Date(), 4)),
        to: z.coerce.date().optional().default(addMonths(new Date(), 4)),
      }),
    )
    .query(async ({ ctx, input }) => {
      // take -3/+3 month from the currentDate
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
          startTime: {
            gte: input.from,
          },
          endTime: {
            lte: input.to,
          },
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
    .input(
      z.object({
        id: z.coerce.number(),
        type: z.enum(["current", "before", "after"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type === "current") {
        return ctx.db.lesson.delete({
          where: {
            id: input.id,
          },
        });
      }
      const event = await ctx.db.lesson.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      const schoolYear = await ctx.db.schoolYear.findUnique({
        where: {
          id: ctx.schoolYearId,
        },
      });
      const endDate = schoolYear?.endDate ?? addMonths(new Date(), 9);

      const events = await ctx.db.lesson.findMany({
        where: {
          subjectId: event.subjectId,
          ...(input.type == "after"
            ? {
                startTime: {
                  gte: event.startTime,
                  lte: endDate,
                },
              }
            : {
                startTime: {
                  gte: schoolYear?.startDate ?? subMonths(new Date(), 9),
                  lte: event.startTime,
                },
              }),
        },
      });

      const targetDayOfTheWeek = getDay(event.startTime);
      const matchingEventIds = events
        .filter((evt) => getDay(evt.startTime) === targetDayOfTheWeek)
        .map((ev) => ev.id);
      return ctx.db.lesson.deleteMany({
        where: {
          id: {
            in: matchingEventIds,
          },
        },
      });
    }),
});
