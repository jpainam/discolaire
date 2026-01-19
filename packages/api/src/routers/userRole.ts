import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { UserRoleLevel } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const userRoleRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.userRole.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      include: {
        _count: {
          select: {
            permissionRoles: true,
            users: true
          },
        },
      },
    });
  }),
  get: protectedProcedure.input(z.string().min(1)).query(({ ctx, input }) => {
    return ctx.db.userRole.findUniqueOrThrow({
      where: {
        id: input,
        schoolId: ctx.schoolId,
      },
      include: {
        _count: {
          select: {
            permissionRoles: true,
            users: true,
          },
        },
      },
    });
  }),
  users: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.userRole.findMany({
        where: {
          schoolId: ctx.schoolId,
          ...(input.q ? {} : {}),
        },
      });
    }),

  permissions: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.db.permissionRole.findMany({
        where: {
          role: {
            id: input,
            schoolId: ctx.schoolId,
          },
          permission: {
            schoolId: ctx.schoolId,
          },
        },
        include: {
          permission: {
            include: {
              module: true,
            },
          },
          role: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        level: z.enum(UserRoleLevel).default(UserRoleLevel.LEVEL4),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userRole.create({
        data: {
          name: input.name,
          isActive: input.isActive,
          level: input.level,
          description: input.description,
          schoolId: ctx.schoolId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        level: z.enum(UserRoleLevel).default(UserRoleLevel.LEVEL4),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userRole.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          isActive: input.isActive,
          level: input.level,
          description: input.description,
          schoolId: ctx.schoolId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.userRole.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
