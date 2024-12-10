import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { AttendanceType } from "@repo/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createPeriodicAttendance = z.object({
  termId: z.coerce.number(),
  classroomId: z.string(),
  students: z.array(
    z.object({
      id: z.string().min(1),
      absence: z.string().optional(),
      lateness: z.string().optional(),
      consigne: z.string().optional(),
      exclusion: z.string().optional(),
      chatter: z.string().optional(),
    }),
  ),
});
export const attendanceRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.cycle.findMany();
  }),
  reasons: protectedProcedure.query(({ ctx }) => {
    return ctx.db.attendanceReason.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
  deletePeriodic: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        termId: z.coerce.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.attendance.deleteMany({
        where: {
          termId: input.termId,
          classroomId: input.classroomId,
        },
      });
    }),
  createPeriodic: protectedProcedure
    .input(createPeriodicAttendance)
    .mutation(({ ctx, input }) => {
      const data: {
        studentId: string;
        type: AttendanceType;
        termId: number;
        classroomId: string;
        schoolYearId: string;
        data: Record<string, string>;
      }[] = [];

      let errorMessage = "";
      input.students.forEach((attend) => {
        if (
          attend.absence ||
          attend.lateness ||
          attend.consigne ||
          attend.exclusion ||
          attend.chatter
        ) {
          errorMessage = testAttendanceFormat(attend) ?? errorMessage;
          data.push({
            studentId: attend.id,
            type: AttendanceType.PERIODICALLY,
            termId: input.termId,
            classroomId: input.classroomId,
            schoolYearId: ctx.schoolYearId,
            data: {
              absence: attend.absence ?? "0",
              lateness: attend.lateness ?? "0",
              consigne: attend.consigne ?? "0",
              exclusion: attend.exclusion ?? "0",
              chatter: attend.chatter ?? "0",
            },
          });
        }
      });
      if (errorMessage) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: errorMessage,
        });
      }
      return ctx.db.attendance.createMany({
        data: data,
      });
    }),
  classroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.coerce.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const absences = await ctx.db.absence.findMany({
        where: {
          classroomId: input.classroomId,
          termId: input.termId,
        },
      });
      const lateness = await ctx.db.lateness.findMany({
        where: {
          classroomId: input.classroomId,
          termId: input.termId,
        },
      });
      let duration = lateness.reduce((acc, curr) => acc + curr.duration, 0);
      let hours = Math.floor(duration / 60);
      let remainingMinutes = duration % 60;
      const latenessvalue = `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;

      const consignes = await ctx.db.consigne.findMany({
        where: {
          classroomId: input.classroomId,
          termId: input.termId,
        },
      });
      duration = consignes.reduce((acc, curr) => acc + curr.duration, 0);
      hours = Math.floor(duration / 60);
      remainingMinutes = duration % 60;
      const consignesvalue = `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;

      const exclusion = await ctx.db.exclusion.count({
        where: {
          classroomId: input.classroomId,
          termId: input.termId,
        },
      });
      const chatters = await ctx.db.chatter.findMany({
        where: {
          classroomId: input.classroomId,
          termId: input.termId,
        },
      });

      return {
        absence: {
          value: absences.reduce((acc, curr) => acc + curr.value, 0),
          justified: 0,
        },
        lateness: {
          value: latenessvalue,
          justified: 0,
        },
        consigne: {
          value: consignesvalue,
          justified: 0,
        },
        exclusion: {
          value: exclusion,
          justified: 0,
        },
        chatter: {
          value: chatters.reduce((acc, curr) => acc + curr.value, 0),
          justified: 0,
        },
      };
    }),
});

function testAttendanceFormat(attend: {
  absence?: string;
  lateness?: string;
  consigne?: string;
  exclusion?: string;
  chatter?: string;
}) {
  const correctFormat = /^\d+(\/\d+)?$/;
  if (attend.absence && !correctFormat.test(attend.absence)) {
    return `invalid absence format ${attend.absence}`;
  }
  if (attend.lateness && !correctFormat.test(attend.lateness)) {
    return `invalid lateness format ${attend.lateness}`;
  }
  if (attend.consigne && !correctFormat.test(attend.consigne)) {
    return `invalid consigne format ${attend.consigne}`;
  }
  if (attend.exclusion && !correctFormat.test(attend.exclusion)) {
    return `invalid exclusion format ${attend.exclusion}`;
  }
  if (attend.chatter && !correctFormat.test(attend.chatter)) {
    return `invalid chatter format ${attend.chatter}`;
  }
  return null;
}
