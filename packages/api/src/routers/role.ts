import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { RoleLevel } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const roleRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.role.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        level: "asc",
      },
      include: {
        _count: {
          select: {
            permissionRoles: true,
            userRoles: true,
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
      await ctx.db.userRole.createMany({
        data: input.userIds.map((userId) => ({
          userId,
          roleId: input.roleId,
        })),
        skipDuplicates: true,
      });
      return ctx.db.role.findUniqueOrThrow({
        include: {
          _count: {
            select: {
              permissionRoles: true,
              userRoles: true,
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
      return ctx.db.role.findUniqueOrThrow({
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
    return ctx.db.role.findUniqueOrThrow({
      where: {
        id: input,
        schoolId: ctx.schoolId,
      },
      include: {
        permissionRoles: true,
        _count: {
          select: {
            permissionRoles: true,
            userRoles: true,
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
      return ctx.db.role.findMany({
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
        level: z.enum(RoleLevel).default(RoleLevel.LEVEL4),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.create({
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
        level: z.enum(RoleLevel).default(RoleLevel.LEVEL4),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.update({
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

  removeUser: protectedProcedure
    .input(
      z.object({
        roleId: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.userRole.deleteMany({
        where: {
          roleId: input.roleId,
          userId: input.userId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.role.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
