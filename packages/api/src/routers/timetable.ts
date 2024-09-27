import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createTimetableSchema = z.object({
  description: z.string().optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  subjectId: z.coerce.number(),
});
export const timetableRouter = createTRPCRouter({
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
    .input(createTimetableSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.timetable.create({
        data: {
          start: input.start,
          end: input.end,
          description: input.description,
          subjectId: input.subjectId,
          createdById: ctx.session.user.id,
        },
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
});
