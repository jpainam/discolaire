import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, subDays } from "date-fns";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";
import { AttendanceType } from "@repo/db";

import { studentService } from "../services";
import { attendanceToData } from "../services/attendance-service";
import { classroomService } from "../services/classroom-service";
import { contactService } from "../services/contact-service";
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
      if (ctx.session.user.profile === "student") {
        const student = await studentService.getFromUserId(ctx.session.user.id);
        studentIds.push(student.id);
      } else if (ctx.session.user.profile === "contact") {
        const contact = await contactService.getFromUserId(ctx.session.user.id);
        const studs = await contactService.getStudents(contact.id);
        studentIds.push(...studs.map((s) => s.studentId));
      } else {
        if (input.classroomId) {
          const students = await classroomService.getStudents(
            input.classroomId,
          );
          studentIds.push(...students.map((st) => st.id));
        }
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        absence: z.coerce.number().default(0),
        justifiedAbsence: z.coerce.number().default(0),
        late: z.coerce.number().default(0),
        justifiedLate: z.coerce.number().default(0),
        exclusion: z.coerce.number().default(0),
        consigne: z.coerce.number().default(0),
        chatter: z.coerce.number().default(0),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.attendance.update({
        where: {
          id: input.id,
        },
        data: {
          data: {
            absence: input.absence,
            justifiedAbsence: input.justifiedAbsence,
            late: input.late,
            justifiedLate: input.justifiedLate,
            exclusion: input.exclusion,
            consigne: input.consigne,
            chatter: input.chatter,
          },
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
            late: z.coerce.number(),
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
      const data = input.attendances
        .filter(
          (a) =>
            a.absence ||
            a.chatter ||
            a.consigne ||
            a.late ||
            a.justifiedAbsence ||
            a.justifiedLate ||
            a.exclusion,
        )
        .map((at) => {
          const d = {
            absence: at.absence,
            justifiedAbsence: at.justifiedAbsence,
            late: at.late,
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
