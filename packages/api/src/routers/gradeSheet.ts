import { z } from "zod";

import { gradeSheetService } from "../services/gradesheet-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const gradeSheetRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.union([z.array(z.coerce.number()), z.coerce.number()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),

  get: protectedProcedure.input(z.number()).query(async ({ ctx, input }) => {
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
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  grades: protectedProcedure
    .input(z.coerce.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.grade.findMany({
        include: {
          student: true,
          gradeSheet: true,
        },
        where: {
          gradeSheetId: input,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        code: z.string().min(1),
        description: z.string().min(1),
        amount: z.number().min(1),
        dueDate: z.date(),
        journalId: z.number(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          description: input.description,
          amount: input.amount,
          dueDate: input.dueDate,
          journal: { connect: { id: input.journalId } },
          isActive: input.isActive,
        },
      });
    }),
});
