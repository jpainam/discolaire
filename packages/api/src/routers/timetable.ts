import type { TRPCRouterRecord } from "@trpc/server";
import { addMonths } from "date-fns";
import { z } from "zod";

import { timetableService } from "../services/timetable-service";
import { protectedProcedure } from "../trpc";

const createTimetableSchema = z.object({
  description: z.string().optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  subjectId: z.coerce.number(),
});
export const timetableRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.timetable.findMany({
      orderBy: {
        start: "asc",
      },
      where: {
        subject: {
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      },
    });
  }),
  all2: protectedProcedure.query(() => {
    return [];
  }),
  classroom: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.timetable.findMany({
        orderBy: {
          start: "asc",
        },
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
    }),
  clearByClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.timetable.deleteMany({
        where: {
          subject: {
            classroomId: input.classroomId,
          },
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.timetable.delete({
      where: {
        id: input,
      },
    });
  }),
  update: protectedProcedure
    .input(createTimetableSchema.extend({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.timetable.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        startTime: z.string().min(1),
        endTime: z.string().min(1),
        subjectId: z.coerce.number(),
        daysOfWeek: z.array(z.coerce.number()).default([]),
        startDate: z.coerce.date(),
      }),
    )
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
        dayOfWeek: 0, //input.dayOfWeek,
        finalDate: schoolYear?.endDate ?? addMonths(new Date(), 9),
      });
      const data = events.map((event) => {
        return {
          start: event.start,
          end: event.end,
          subjectId: input.subjectId,
          createdById: ctx.session.user.id,
        };
      });
      return ctx.db.timetable.createMany({
        data: data,
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.timetable.findUnique({
      include: {
        subject: {
          include: {
            teacher: true,
            classroom: true,
          },
        },
      },
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
