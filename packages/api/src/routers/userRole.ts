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
            users: true,
          },
        },
      },
    });
  }),
  addUsers: protectedProcedure
    .input(
      z.object({
        roleId: z.string().min(1),
        userIds: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const userId of input.userIds) {
        await ctx.db.user.update({
          data: {
            userRoleId: input.roleId,
          },
          where: {
            id: userId,
          },
        });
      }
      return ctx.db.userRole.findUniqueOrThrow({
        include: {
          _count: {
            select: {
              permissionRoles: true,
            },
          },
        },
        where: {
          id: input.roleId,
        },
      });
    }),
  addPermissions: protectedProcedure
    .input(
      z.object({
        roleId: z.string().min(1),
        permissionIds: z
          .object({
            id: z.string().min(1),
            effect: z.enum(["allow", "deny"]),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      for (const p of input.permissionIds) {
        await ctx.db.permissionRole.upsert({
          create: {
            effect: p.effect,
            roleId: input.roleId,
            permissionId: p.id,
          },
          update: {
            effect: p.effect,
          },
          where: {
            permissionId_roleId: {
              permissionId: p.id,
              roleId: input.roleId,
            },
          },
        });
      }
      return ctx.db.userRole.findUniqueOrThrow({
        include: {
          _count: {
            select: {
              permissionRoles: true,
            },
          },
        },
        where: {
          id: input.roleId,
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
        permissionRoles: true,
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
