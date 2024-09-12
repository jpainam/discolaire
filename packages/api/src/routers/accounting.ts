import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const accountingRouter = createTRPCRouter({
  groups: protectedProcedure.query(({ ctx }) => {
    return ctx.db.accountingGroup.findMany({
      include: {
        createdBy: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  deleteGroup: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingGroup.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  updateGroup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingGroup.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
      });
    }),
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingGroup.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
      });
    }),
});
