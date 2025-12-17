import type { TRPCRouterRecord } from "@trpc/server";
import * as z from "zod";

import { protectedProcedure } from "../trpc";

export const skillAcquisitionRouter = {
  all: protectedProcedure
    .input(
      z
        .object({
          classroomId: z.string().optional(),
          termId: z.string().optional(),
        })
        .optional(),
    )
    .query(({ ctx, input }) => {
      return ctx.db.skillAcquisition.findMany({
        where: {
          ...(input?.termId ? { termId: input.termId } : {}),
          subject: {
            ...(input?.classroomId ? { classroomId: input.classroomId } : {}),
            classroom: {
              schoolYearId: ctx.schoolYearId,
              schoolId: ctx.schoolId,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        termId: z.string().min(1),
        subjectId: z.coerce.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.skillAcquisition.upsert({
        where: {
          termId_subjectId: {
            termId: input.termId,
            subjectId: input.subjectId,
          },
        },
        update: {
          content: input.content,
        },
        create: {
          content: input.content,
          termId: input.termId,
          subjectId: input.subjectId,
          createdById: ctx.session.user.id,
        },
      });
    }),
} satisfies TRPCRouterRecord;
