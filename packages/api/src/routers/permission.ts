import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const permissionRouter = createTRPCRouter({
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
    .input(z.number())
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
