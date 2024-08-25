import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  byCategory: protectedProcedure
    .input(
      z.object({
        category: z.enum(["student", "classroom"]),
      }),
    )
    .query(({ input, ctx }) => {
      return ctx.db.menuItem.findMany({
        where: {
          category: input.category,
          isActive: true,
        },
        include: {
          menuItems: {
            where: {
              isActive: true,
            },
            include: {
              subSubMenuItem: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.delete({ where: { id: input.id } });
    }),
});
