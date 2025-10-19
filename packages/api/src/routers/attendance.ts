import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, subDays } from "date-fns";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";
import { AttendanceType } from "@repo/db";

import { attendanceToData } from "../services/attendance-service";
import { classroomService } from "../services/classroom-service";
import { protectedProcedure } from "../trpc";

export const attendanceRouter = {
  all: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().optional(),
        termId: z.string().optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const studentIds: string[] = [];
      if (input.classroomId) {
        const students = await classroomService.getStudents(input.classroomId);
        studentIds.push(...students.map((st) => st.id));
      }
      const attendances = await ctx.db.attendance.findMany({
        include: {
          student: true,
          term: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
          studentId: {
            in: studentIds,
          },
          ...(input.termId ? { termId: input.termId } : {}),
          ...(input.from ? { createdAt: { gte: subDays(input.from, 1) } } : {}),
          ...(input.to ? { createdAt: { lte: addDays(input.to, 1) } } : {}),
        },
      });
      return attendances.map((a) => {
        const d = attendanceToData(a.data);
        return {
          ...a,
          ...d,
        };
      });
    }),
  get: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      const at = await ctx.db.attendance.findUniqueOrThrow({
        include: {
          term: true,
          student: true,
          createdBy: true,
        },
        where: {
          id: input,
        },
      });
      return {
        ...at,
        ...attendanceToData(at.data),
      };
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.attendance.delete({
        where: {
          id: input,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        attendances: z.array(
          z.object({
            studentId: z.string().min(1),
            absence: z.coerce.number(),
            justifiedAbsence: z.coerce.number(),
            lateness: z.coerce.number(),
            justifiedLate: z.coerce.number(),
            consigne: z.coerce.number(),
            chatter: z.coerce.number(),
            exclusion: z.coerce.number(),
          }),
        ),
        termId: z.string().min(1),
        classroomId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((st) => st.id);
      await ctx.db.attendance.deleteMany({
        where: {
          termId: input.termId,
          studentId: {
            in: studentIds,
          },
        },
      });
      const data = input.attendances
        .filter(
          (a) =>
            a.absence ||
            a.chatter ||
            a.consigne ||
            a.lateness ||
            a.justifiedAbsence ||
            a.justifiedLate,
        )
        .map((at) => {
          const d = {
            absence: at.absence,
            justifiedAbsence: at.justifiedAbsence,
            lateness: at.lateness,
            justifiedLate: at.justifiedLate,
            chatter: at.chatter,
            consigne: at.consigne,
            exclusion: at.exclusion,
          } as Prisma.JsonObject;
          return {
            studentId: at.studentId,
            data: d,
            type: AttendanceType.PERIODIC,
            createdById: ctx.session.user.id,
            termId: input.termId,
          };
        });
      return ctx.db.attendance.createMany({
        data: data,
      });
    }),

  student: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attendances = await ctx.db.attendance.findMany({
        include: {
          term: true,
          student: true,
        },
        where: {
          studentId: input.studentId,
          ...(input.termId ? { termId: { in: input.termId } } : {}),
        },
      });
      return attendances.map((a) => {
        const d = attendanceToData(a.data);
        return {
          ...a,
          ...d,
        };
      });
    }),
} satisfies TRPCRouterRecord;
