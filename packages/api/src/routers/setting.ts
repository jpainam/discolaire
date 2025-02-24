import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const settingRouter = createTRPCRouter({
  sports: protectedProcedure.query(({ ctx }) => {
    return ctx.db.sport.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
  clubs: protectedProcedure.query(({ ctx }) => {
    return ctx.db.club.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
  deleteSport: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.sport.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  deleteClub: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.club.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  updateSport: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.sport.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  updateClub: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid().min(1),
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.club.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  createSport: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.sport.create({
        data: {
          schoolId: ctx.schoolId,
          name: input.name,
        },
      });
    }),
  createClub: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.club.create({
        data: {
          schoolId: ctx.schoolId,
          name: input.name,
        },
      });
    }),
});
