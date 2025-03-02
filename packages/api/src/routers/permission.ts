import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const permissionRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.permission.findMany({
      orderBy: {
        code: "asc",
      },
      where: {
        group: {
          schoolId: ctx.schoolId,
        },
      },
    });
  }),
  groups: protectedProcedure.query(({ ctx }) => {
    return ctx.db.permissionGroup.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  updateGroup: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.permissionGroup.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
    }),
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.permissionGroup.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.permission.delete({
        where: {
          id: input,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        code: z.string().min(1),
        groupId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.permission.create({
        data: {
          title: input.title,
          code: input.code,
          groupId: input.groupId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        code: z.string().min(1),
        groupId: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.permission.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          groupId: input.groupId,
          code: input.code,
        },
      });
    }),
  policies: protectedProcedure.query(async ({ ctx }) => {
    const policies = await ctx.db.policy.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const countUsers = await ctx.db.userPolicy.groupBy({
      by: ["policyId"],
      _count: {
        _all: true,
      },
    });
    const countRoles = await ctx.db.rolePolicy.groupBy({
      by: ["policyId"],
      _count: {
        _all: true,
      },
    });
    return policies.map((policy) => {
      return {
        ...policy,
        roles:
          countRoles.find((count) => count.policyId === policy.id)?._count
            ._all ?? 0,
        users:
          countUsers.find((count) => count.policyId === policy.id)?._count
            ._all ?? 0,
      };
    });
  }),
  getRole: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.role.findUnique({
        include: {
          policies: true,
          roles: true,
        },
        where: {
          id: input,
        },
      });
    }),
  roles: protectedProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.role.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const countUsers = await ctx.db.userRole.groupBy({
      by: ["roleId"],
      _count: {
        _all: true,
      },
    });
    const countPolicy = await ctx.db.rolePolicy.groupBy({
      by: ["roleId"],
      _count: {
        _all: true,
      },
    });
    return roles.map((role) => {
      return {
        ...role,
        policies:
          countPolicy.find((count) => count.roleId === role.id)?._count._all ??
          0,
        users:
          countUsers.find((count) => count.roleId === role.id)?._count._all ??
          0,
      };
    });
  }),
});
