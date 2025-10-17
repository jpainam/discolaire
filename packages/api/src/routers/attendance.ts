import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { attendanceToData } from "../services/attendance-service";
import { protectedProcedure } from "../trpc";

export const attendanceRouter = {
  all: protectedProcedure.query(async ({ ctx }) => {
    const attendances = await ctx.db.attendance.findMany({
      include: {
        student: true,
        term: true,
      },
      where: {
        term: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
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

  student: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const attendances = await ctx.db.attendance.findMany({
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
