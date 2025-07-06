import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const classroomSectionRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.classroomSection.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.classroomSection.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.classroomSection.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
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
      return ctx.db.classroomSection.create({
        data: {
          name: input.name,
          schoolId: ctx.session.user.schoolId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
