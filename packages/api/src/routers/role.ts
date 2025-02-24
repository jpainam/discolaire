import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
export const roleRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
  addUsers: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        userIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = input.userIds.map((userId) => {
        return {
          roleId: input.roleId,
          userId: userId,
          createdById: ctx.session.user.id,
        };
      });
      return ctx.db.userRole.createMany({
        data: data,
        skipDuplicates: true,
      });
    }),
  users: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        q: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qq = input.q ? `%${input.q}%` : "%";
      return ctx.db.userRole.findMany({
        where: {
          roleId: input.roleId,
          user: {
            OR: [
              {
                name: {
                  contains: qq,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: qq,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
        include: {
          user: true,
          role: true,
        },
      });
    }),
  attachPolicies: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        policyIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = input.policyIds.map((policyId) => {
        return {
          roleId: input.roleId,
          policyId: policyId,
          createdById: ctx.session.user.id,
        };
      });
      await ctx.db.rolePolicy.deleteMany({
        where: {
          roleId: input.roleId,
        },
      });
      return ctx.db.rolePolicy.createMany({
        data: data,
        skipDuplicates: true,
      });
    }),
  removeRole: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userRole.delete({
        where: {
          userId_roleId: {
            roleId: input.roleId,
            userId: input.userId,
          },
        },
      });
    }),
  policies: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.rolePolicy.findMany({
        include: {
          policy: true,
        },
        where: {
          roleId: input,
        },
      });
    }),
  attach: protectedProcedure
    .input(
      z.object({
        roleId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userRole.create({
        data: {
          roleId: input.roleId,
          userId: input.userId,
          createdById: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      createUpdateRoleSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          updatedBy: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateRoleSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.role.create({
        data: {
          ...input,
          schoolId: ctx.schoolId,
          createdBy: ctx.session.user.id,
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    const roles = await ctx.db.role.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
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
