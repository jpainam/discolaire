import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const moduleRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.module.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        permissions: true,
        _count: {
          select: {
            permissions: true,
          },
        },
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.module.findUniqueOrThrow({
      where: {
        id: input,
      },
      include: {
        permissions: true,
        _count: {
          select: {
            permissions: true,
            
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
        description: z.string().min(1),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.module.create({
        data: {
          name: input.name,
          code: input.code,
          description: input.description,
          isActive: input.isActive,
          schoolId: ctx.schoolId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        code: z.string().min(1),
        description: z.string().min(1),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.module.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.id,
          name: input.name,
          code: input.code,
          description: input.description,
          isActive: input.isActive,
          schoolId: ctx.schoolId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ input, ctx }) => {
      return ctx.db.module.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
