import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { getTrimesterTermIds } from "../services/attendance-service";
import { classroomService } from "../services/classroom-service";
import {
  accumulateDisciplineForTerms,
  aggregateAllTermsForYear,
  aggregateTermMetrics,
} from "../services/discipline-service";
import { protectedProcedure } from "../trpc";

export const disciplineRouter = {
  annual: protectedProcedure
    .input(
      z.object({
        classroomId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return aggregateAllTermsForYear(input.classroomId, ctx.schoolYearId);
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
      return aggregateTermMetrics({
        studentIds,
        classroomId: input.classroomId,
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
      const [seq1, seq2] = await getTrimesterTermIds(
        input.trimestreId,
        ctx.schoolYearId,
      );
      const students = await classroomService.getStudents(input.classroomId);
      const studentIds = students.map((s) => s.id);

      return accumulateDisciplineForTerms({
        studentIds,
        classroomId: input.classroomId,
        termIds: [seq1, seq2],
      });
    }),
} satisfies TRPCRouterRecord;
