import { z } from "zod";

import { gradeService } from "../services/grade-service";
import { gradeSheetService } from "../services/gradesheet-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gradeRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.grade.delete({
        where: {
          id: input,
        },
      });
    }),
  get: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.findUnique({
        include: {
          subject: {
            include: {
              course: true,
              teacher: {
                select: {
                  id: true,
                  lastName: true,
                  firstName: true,
                },
              },
            },
          },
          term: true,
        },
        where: {
          id: input,
        },
      });
    }),
  successRate: protectedProcedure.input(z.number()).query(async ({ input }) => {
    return gradeSheetService.sucessRate(input);
  }),
  all: protectedProcedure
    .input(
      z.optional(
        z.object({
          gradeSheetId: z.coerce.number().optional(),
        }),
      ),
    )
    .query(async ({ input, ctx }) => {
      if (input?.gradeSheetId) {
        return gradeService.getGradesByGradesheetId(input.gradeSheetId);
      }
      return ctx.db.grade.findMany({
        orderBy: {
          gradeSheetId: "desc",
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        grade: z.number(),
        isAbsent: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.grade.update({
        where: {
          id: input.id,
        },
        data: {
          grade: input.isAbsent ? 0 : input.grade,
          isAbsent: input.isAbsent,
        },
      });
    }),
});
