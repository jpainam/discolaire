import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const gradeRouter = {
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
} satisfies TRPCRouterRecord;
