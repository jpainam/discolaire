import { sum } from "lodash";
import { z } from "zod";

import { classroomService } from "../services/classroom-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const disciplineRouter = createTRPCRouter({
  student: protectedProcedure
    .input(
      z.object({
        studentId: z.string().min(1),
        termId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const absence = await ctx.db.absence.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: input.studentId,
          termId: input.termId,
        },
      });
      const lateness = await ctx.db.lateness.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: input.studentId,
          termId: input.termId,
        },
      });
      const consigne = await ctx.db.consigne.findMany({
        where: {
          studentId: input.studentId,
          termId: input.termId,
        },
      });
      return {
        absence: absence.length,
        justifiedAbsence: sum(
          absence.filter((a) => a.justification).map((ab) => ab.value),
        ),
        lateness: lateness.length,
        justifiedLateness: sum(
          lateness.filter((a) => a.justification).map((ab) => ab.duration),
        ),
        consigne: consigne.length,
      };
    }),
  classroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
        termId: z.coerce.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((s) => s.id);
      const absences = await ctx.db.absence.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: {
            in: studentIds,
          },
          termId: input.termId,
        },
      });
      const lateness = await ctx.db.lateness.findMany({
        include: {
          justification: true,
        },
        where: {
          studentId: {
            in: studentIds,
          },
          termId: input.termId,
        },
      });
      const consignes = await ctx.db.consigne.findMany({
        where: {
          studentId: {
            in: studentIds,
          },
          termId: input.termId,
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
      for (const student of students) {
        disciplines.set(student.id, {
          absence: 0,
          studentId: student.id,
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
          if (absence.justification) {
            student.justifiedAbsence += absence.value;
          }
        }
      }
      for (const late of lateness) {
        const student = disciplines.get(late.studentId);
        if (student) {
          student.lateness++;
          if (late.justification) {
            student.justifiedLateness += late.duration;
          }
        }
      }
      for (const consigne of consignes) {
        const student = disciplines.get(consigne.studentId);
        if (student) {
          student.consigne++;
        }
      }
      // return Array.from(disciplines.entries()).map(
      //   ([studentId, discipline]) => ({
      //     studentId,
      //     ...discipline,
      //   }),
      // );
      return disciplines;
    }),
});
