import { z } from "zod";

import { gradeService } from "../services/grade-service";
import { gradeSheetService } from "../services/gradesheet-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateStringColor } from "../utils";

export const gradeRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.union([z.array(z.number()), z.number()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.gradeSheet.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
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
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        shortName: z.string().min(1),
        reportName: z.string().min(1),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.course.create({
        data: {
          shortName: input.shortName,
          name: input.name,
          reportName: input.reportName,
          isActive: input.isActive,
          color: generateStringColor(),
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
