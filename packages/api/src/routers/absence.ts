import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const absenceRouter = {
  get: protectedProcedure.input(z.coerce.number()).query(({ ctx, input }) => {
    return ctx.db.absence.findUniqueOrThrow({
      include: {
        justification: true,
      },
      where: {
        id: input,
      },
    });
  }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.absence.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        justification: true,
        student: true,
      },
      where: {
        term: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      },
    });
  }),
  justify: protectedProcedure
    .input(
      z.object({
        absenceId: z.coerce.number(),
        reason: z.string().min(1),
        comment: z.string().optional(),
        value: z.coerce.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.absenceJustification.create({
        data: {
          reason: input.reason,
          absenceId: input.absenceId,
          createdById: ctx.session.user.id,
          value: input.value,
        },
      });
    }),
  studentSummary: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const absences = await ctx.db.absence.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: input.studentId,
          classroom: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
      const justifications = absences.filter(
        (absence) => absence.justification,
      );
      return {
        total: absences.reduce((acc, curr) => acc + curr.value, 0),
        value: absences.reduce((acc, curr) => acc + curr.value, 0),
        justified: justifications.reduce(
          (acc, curr) => acc + (curr.justification?.value ?? 0),
          0,
        ),
      };
    }),
  byClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.coerce.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.absence.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          justification: true,
          student: true,
        },
        where: {
          classroomId: input.classroomId,
          term: {
            ...(input.termId && { id: input.termId }),
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }),
  byStudent: protectedProcedure
    .input(
      z.object({ studentId: z.string().min(1), termId: z.number().optional() }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.absence.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          justification: true,
        },
        where: {
          studentId: input.studentId,
          term: {
            ...(input.termId && { id: input.termId }),
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
      });
    }),
  deleteJustification: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.absenceJustification.delete({
        where: {
          id: input,
        },
      });
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        status: z.enum(["approved", "rejected", "pending"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.absenceJustification.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
  createClassroom: protectedProcedure
    .input(
      z.object({
        termId: z.coerce.number(),
        classroomId: z.string().min(1),
        students: z.array(
          z.object({
            id: z.string().min(1),
            absence: z.coerce.number().optional(),
            justify: z.coerce.number().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const absences = [];
      for (const student of input.students) {
        if (!student.absence) {
          continue;
        }
        const absence = await ctx.db.absence.create({
          data: {
            termId: input.termId,
            studentId: student.id,
            classroomId: input.classroomId,
            date: new Date(),
            createdById: ctx.session.user.id,
            value: student.absence,
          },
        });
        absences.push(absence);
        if (student.justify)
          await ctx.db.absenceJustification.create({
            data: {
              absenceId: absence.id,
              status: "approved",
              value: student.justify,
              approvedBy: ctx.session.user.id,
              createdById: ctx.session.user.id,
            },
          });
      }
      return absences;
    }),
  create: protectedProcedure
    .input(
      z.object({
        termId: z.coerce.number(),
        classroomId: z.string().min(1),
        date: z.coerce.date().default(() => new Date()),
        value: z.coerce.number(),
        justify: z.coerce.number().optional(),
        studentId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const absence = await ctx.db.absence.create({
        data: {
          termId: input.termId,
          studentId: input.studentId,
          classroomId: input.classroomId,
          date: input.date,
          createdById: ctx.session.user.id,
          value: input.value,
        },
      });
      if (input.justify) {
        await ctx.db.absenceJustification.create({
          data: {
            absenceId: absence.id,
            status: "approved",
            value: input.justify,
            approvedBy: ctx.session.user.id,
            createdById: ctx.session.user.id,
          },
        });
      }
      return absence;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        termId: z.coerce.number(),
        value: z.coerce.number(),
        justify: z.coerce.number().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const absence = await ctx.db.absence.update({
        where: {
          id: input.id,
        },
        data: {
          termId: input.termId,
          value: input.value,
        },
      });
      if (input.justify) {
        await ctx.db.absenceJustification.create({
          data: {
            absenceId: absence.id,
            status: "approved",
            value: input.justify,
            approvedBy: ctx.session.user.id,
            createdById: ctx.session.user.id,
          },
        });
      }
      return absence;
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.absence.delete({
        where: {
          id: input,
        },
      });
    }),
  studentJustifications: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.absence.findMany({
        where: {
          studentId: input.studentId,
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
        include: {
          justification: true,
          term: true,
        },
      });
    }),
  classroomJustifications: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.absence.findMany({
        where: {
          classroomId: input.classroomId,
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
        },
        include: {
          justification: true,
          term: true,
        },
      });
    }),
  createPreventAbsence: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
        reason: z.string().min(1),
        studentId: z.string().min(1),
        attachments: z.array(z.string()).optional(),
        comment: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.preventedAbsence.create({
        data: {
          from: input.from,
          createdById: ctx.session.user.id,
          to: input.to,
          studentId: input.studentId,
          reason: input.reason,
          attachments: input.attachments,
          comment: input.comment,
        },
      });
    }),
} satisfies TRPCRouterRecord;
