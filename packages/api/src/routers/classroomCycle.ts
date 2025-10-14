import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const classroomCycleRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.classroomCycle.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.classroomCycle.delete({
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
      return ctx.db.classroomCycle.update({
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
      return ctx.db.classroomCycle.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
