import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { classroomService } from "../services/classroom-service";
import { protectedProcedure } from "../trpc";

export const periodicAttendanceRouter = {
  all: protectedProcedure
    .input(
      z.object({
        termId: z.string().optional(),
        classroomId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const studentIds: string[] = [];
      if (input.classroomId) {
        const students = await classroomService.getStudents(input.classroomId);
        studentIds.push(...students.map((st) => st.id));
      }
      return ctx.db.periodicAttendance.findMany({
        where: {
          ...(input.termId ? { termId: input.termId } : {}),
          ...(input.classroomId ? { studentId: { in: studentIds } } : {}),
          term: {
            schoolId: ctx.schoolId,
            schoolYearId: ctx.schoolYearId,
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
            absence: z.coerce.number().optional(),
            justifiedAbsence: z.number().optional(),
            lateness: z.number().optional(),
            justifiedLateness: z.number().optional(),
            consigne: z.number().optional(),
            chatter: z.number().optional(),
          }),
        ),
        termId: z.string().min(1),
        classroomId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((st) => st.id);
      await ctx.db.periodicAttendance.deleteMany({
        where: {
          termId: input.termId,
          studentId: {
            in: studentIds,
          },
        },
      });
      const data = input.attendances
        .filter((a) => a.absence || a.chatter || a.consigne || a.lateness)
        .map((at) => {
          return {
            studentId: at.studentId,
            absence: at.absence ?? 0,
            justifiedAbsence: at.justifiedAbsence ?? 0,
            lateness: at.lateness,
            justifiedLateness: at.justifiedLateness,
            chatter: at.chatter ?? 0,
            consigne: at.consigne ?? 0,
            createdById: ctx.session.user.id,
            termId: input.termId,
          };
        });
      return ctx.db.periodicAttendance.createMany({
        data: data,
      });
    }),
} satisfies TRPCRouterRecord;
