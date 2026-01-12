import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const accountingJournal = {
  student: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        termId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.services.student.getClassroom(
        input.studentId,
        ctx.schoolYearId,
      );
      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "L'éléve n'est pas inscrit",
        });
      }
      const snapshot = await ctx.db.studentAcademicSnapshot.findFirst({
        where: {
          studentId: input.studentId,
          classroomId: classroom.id,
          ...(input.termId ? { termId: input.termId } : {}),
        },
      });
      const d = snapshot ? snapshotsToData(snapshot.data) : {};
      return {
        ...snapshot,
        ...d,
      };
    }),

  //create: protectedProcedure.input(z.object()).mutation()
} satisfies TRPCRouterRecord;

export function snapshotsToData(data: Prisma.JsonValue) {
  const d = (data ?? {}) as Prisma.JsonObject;
  return {};
}
