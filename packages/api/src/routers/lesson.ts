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
export const lessonRouter = {
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
      if (input.isRepeating) {
        while (event.start <= endDate) {
          event.start = addDays(event.start, 7);
          event.end = addDays(event.end, 7);
          events.push({ ...event });
        }
      }
      return ctx.db.lesson.createMany({
        data: events,
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
      return ctx.db.lesson.deleteMany({
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
