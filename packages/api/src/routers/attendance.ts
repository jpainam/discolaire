import type { TRPCRouterRecord } from "@trpc/server";
import { addDays, format, subDays } from "date-fns";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";
import { AttendanceType } from "@repo/db";

import { attendanceToData } from "../services/attendance-service";
import { protectedProcedure } from "../trpc";

export const attendanceRouter = {
  all: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().optional(),
        termId: z.string().nullish(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        limit: z.coerce.number().default(1000),
      }),
    )
    .query(async ({ ctx, input }) => {
      const studentIds: string[] = [];
      if (ctx.session.user.profile === "student") {
        const student = await ctx.services.student.getFromUserId(
          ctx.session.user.id,
        );
        studentIds.push(student.id);
      } else if (ctx.session.user.profile === "contact") {
        const contact = await ctx.services.contact.getFromUserId(
          ctx.session.user.id,
        );
        const studs = await ctx.services.contact.getStudents(contact.id);
        studentIds.push(...studs.map((s) => s.studentId));
      } else {
        if (input.classroomId) {
          const students = await ctx.services.classroom.getStudents(
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
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
          },
          ...(studentIds.length == 0
            ? {}
            : {
                studentId: {
                  in: studentIds,
                },
              }),
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

  createStudent: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        termId: z.string(),
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
      return ctx.db.attendance.create({
        data: {
          studentId: input.studentId,
          termId: input.termId,
          type: AttendanceType.PERIODIC,
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
  count: protectedProcedure
    .input(
      z.object({
        schoolYearId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const schyid = input.schoolYearId ?? ctx.schoolYearId;
      const attendances = await ctx.db.attendance.findMany({
        where: {
          term: {
            schoolYearId: schyid,
          },
        },
      });
      let absence = 0;
      let chatter = 0;
      let justifiedAbsence = 0;
      let justifiedLate = 0;
      let consigne = 0;
      let exclusion = 0;
      let late = 0;
      for (const att of attendances) {
        const d = attendanceToData(att.data);
        absence += d.absence;
        chatter += d.chatter;
        exclusion += d.exclusion;
        justifiedAbsence += d.justifiedAbsence;
        justifiedLate += d.justifiedLate;
        late += d.late;
        consigne += d.consigne;
      }
      return {
        absence,
        chatter,
        consigne,
        justifiedAbsence,
        justifiedLate,
        exclusion,
        late,
      };
    }),
  chart: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.attendance.findMany({
      where: {
        term: {
          schoolYearId: ctx.schoolYearId,
        },
      },
    });
    const attendances = data.map((a) => {
      const d = attendanceToData(a.data);
      return {
        createdAt: a.createdAt,
        ...d,
      };
    });
    const grouped = new Map<
      string,
      {
        absence: number;
        chatter: number;
        consigne: number;
        exclusion: number;
        late: number;
        justifiedAbsence: number;
        justifiedLate: number;
      }
    >();
    for (const item of attendances) {
      const dateKey = format(item.createdAt, "yyyy-MM-dd");

      const current = grouped.get(dateKey) ?? {
        absence: 0,
        chatter: 0,
        consigne: 0,
        exclusion: 0,
        late: 0,
        justifiedAbsence: 0,
        justifiedLate: 0,
      };

      grouped.set(dateKey, {
        absence: current.absence + item.absence,
        chatter: current.chatter + item.chatter,
        late: current.late + item.late,
        exclusion: current.exclusion + item.exclusion,
        consigne: current.consigne + item.consigne,
        justifiedAbsence: current.justifiedAbsence + item.justifiedAbsence,
        justifiedLate: current.justifiedLate + item.justifiedLate,
      });
    }
    return Array.from(grouped, ([date, values]) => ({ date, ...values }));
  }),
  clearAll: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const students = await ctx.services.classroom.getStudents(
        input.classroomId,
      );
      const studentIds = students.map((s) => s.id);
      return ctx.db.attendance.deleteMany({
        where: {
          studentId: { in: studentIds },
          ...(input.termId ? { termId: input.termId } : {}),
        },
      });
    }),
} satisfies TRPCRouterRecord;
