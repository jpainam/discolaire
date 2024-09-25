import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const classroomSectionRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.section.findMany();
  }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.section.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        id: z.coerce.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.section.update({
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
      return ctx.db.section.create({
        data: {
          name: input.name,
          schoolId: ctx.session.user.schoolId,
        },
      });
    }),
});
