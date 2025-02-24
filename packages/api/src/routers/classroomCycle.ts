import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const classroomCycleRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.cycle.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cycle.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cycle.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          schoolId: ctx.session.user.schoolId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cycle.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
});
