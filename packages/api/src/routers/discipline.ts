import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@repo/db";

import { classroomService } from "../services/classroom-service";
import { protectedProcedure } from "../trpc";

export const disciplineRouter = {
  annual: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const terms = await ctx.db.term.findMany({
        where: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((s) => s.id);
      const disciplines = new Map<
        string,
        {
          absence: number;
          studentId: string;
          justifiedAbsence: number;
          lateness: number;
          justifiedLateness: number;
          consigne: number;
        }
      >();
      for (const studentId of studentIds) {
        disciplines.set(studentId, {
          absence: 0,
          studentId: studentId,
          justifiedAbsence: 0,
          lateness: 0,
          justifiedLateness: 0,
          consigne: 0,
        });
      }
      await Promise.all(
        terms.map(async (term) => {
          const disc = await getDiscipline({
            studentIds: studentIds,
            termId: term.id,
          });
          for (const [studentId, discipline] of disc) {
            const student = disciplines.get(studentId);
            if (student) {
              student.absence += discipline.absence;
              student.justifiedAbsence += discipline.justifiedAbsence;
              student.lateness += discipline.lateness;
              student.justifiedLateness += discipline.justifiedLateness;
              student.consigne += discipline.consigne;
            }
          }
        }),
      );
      return disciplines;
    }),
  sequence: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((s) => s.id);
      return getDiscipline({
        studentIds,
        termId: input.termId,
      });
    }),

  trimestre: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        trimestreId: z.enum(["trim1", "trim2", "trim3"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const terms = await ctx.db.term.findMany({
        where: {
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
      if (terms.length < 6) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Not enough terms ${terms.length} found for schoolId: ${ctx.schoolId}, schoolYearId: ${ctx.schoolYearId}`,
        });
      }
      const sortedTerms = terms.sort((a, b) => a.order - b.order);

      let seq1: string | null;
      let seq2: string | null;
      if (input.trimestreId === "trim1") {
        seq1 = sortedTerms[0]?.id ?? null;
        seq2 = sortedTerms[1]?.id ?? null;
      } else if (input.trimestreId === "trim2") {
        seq1 = sortedTerms[2]?.id ?? null;
        seq2 = sortedTerms[3]?.id ?? null;
      } else {
        seq1 = sortedTerms[4]?.id ?? null;
        seq2 = sortedTerms[5]?.id ?? null;
      }
      if (!seq1 || !seq2) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Trimestre not found",
        });
      }
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((s) => s.id);
      const disciplines = new Map<
        string,
        {
          absence: number;
          studentId: string;
          justifiedAbsence: number;
          lateness: number;
          justifiedLateness: number;
          consigne: number;
        }
      >();
      for (const studentId of studentIds) {
        disciplines.set(studentId, {
          absence: 0,
          studentId: studentId,
          justifiedAbsence: 0,
          lateness: 0,
          justifiedLateness: 0,
          consigne: 0,
        });
      }
      await Promise.all(
        [seq1, seq2].map(async (seq) => {
          const disc = await getDiscipline({
            studentIds: studentIds,
            termId: seq,
          });
          for (const [studentId, discipline] of disc) {
            const student = disciplines.get(studentId);
            if (student) {
              student.absence += discipline.absence;
              student.justifiedAbsence += discipline.justifiedAbsence;
              student.lateness += discipline.lateness;
              student.justifiedLateness += discipline.justifiedLateness;
              student.consigne += discipline.consigne;
            }
          }
        }),
      );

      return disciplines;
    }),
} satisfies TRPCRouterRecord;

async function getDiscipline({
  studentIds,
  termId,
}: {
  studentIds: string[];
  termId: string;
}) {
  const absences = await db.absence.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
  });
  const lateness = await db.lateness.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
  });
  const consignes = await db.consigne.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
  });
  const disciplines = new Map<
    string,
    {
      absence: number;
      studentId: string;
      justifiedAbsence: number;
      lateness: number;
      justifiedLateness: number;
      consigne: number;
    }
  >();
  for (const studentId of studentIds) {
    disciplines.set(studentId, {
      absence: 0,
      studentId: studentId,
      justifiedAbsence: 0,
      lateness: 0,
      justifiedLateness: 0,
      consigne: 0,
    });
  }
  for (const absence of absences) {
    const student = disciplines.get(absence.studentId);
    if (student) {
      student.absence++;
      if (absence.justified) {
        student.justifiedAbsence += absence.justified;
      }
    }
  }
  for (const late of lateness) {
    const student = disciplines.get(late.studentId);
    if (student) {
      student.lateness++;
      if (late.justified) {
        student.justifiedLateness += late.justified;
      }
    }
  }
  for (const consigne of consignes) {
    const student = disciplines.get(consigne.studentId);
    if (student) {
      student.consigne++;
    }
  }
  return disciplines;
}
