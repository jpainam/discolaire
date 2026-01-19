import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { PermissionType } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const permissionRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.permission.findMany({
      include: {
        module: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            permissionRoles: true,
          },
        },
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        moduleId: z.string().min(1),
        type: z.enum(PermissionType).default(PermissionType.ACTION),
        resource: z.string().min(1),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.permission.create({
        data: {
          name: input.name,
          isActive: input.isActive,
          type: input.type,
          resource: input.resource,
          moduleId: input.moduleId,
          schoolId: ctx.schoolId,
        },
      });
    }),
  addToRole: protectedProcedure
    .input(
      z.object({
        permissionId: z.string().min(1),
        roleId: z.string().min(1),
        effect: z.enum(["allow", "deny"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.permissionRole.upsert({
        create: {
          permissionId: input.permissionId,
          effect: input.effect,
          roleId: input.roleId,
        },
        update: {
          effect: input.effect,
        },
        where: {
          permissionId_roleId: {
            permissionId: input.permissionId,
            roleId: input.roleId,
          },
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        moduleId: z.string().min(1),
        type: z.enum(PermissionType).default(PermissionType.ACTION),
        resource: z.string().min(1),
        isActive: z.boolean().optional().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.permission.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          isActive: input.isActive,
          type: input.type,
          resource: input.resource,
          moduleId: input.moduleId,
          schoolId: ctx.schoolId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.permission.delete({
        where: {
          id: input,
        },
      });
    }),
} satisfies TRPCRouterRecord;
