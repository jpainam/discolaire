import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const religionRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.religion.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        createdBy: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.religion.findUnique({
      where: {
        id: input,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.religion.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.religion.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.religion.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
          createdById: ctx.session.user.id,
        },
      });
    }),
});
