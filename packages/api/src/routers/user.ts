import type { TRPCRouterRecord } from "@trpc/server";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createUser,
  getEntityById,
  getPermissions,
  userService,
} from "../services/user-service";
import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  search: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(30),
        query: z.string().optional().default(""),
      }),
    )
    .query(({ ctx, input }) => {
      const q = `%${input.query}%`;
      return ctx.db.user.findMany({
        take: input.limit,
        orderBy: {
          name: "asc",
        },
        where: {
          schoolId: ctx.schoolId,
          OR: [
            { name: { startsWith: q } },
            { profile: { startsWith: q } },
            { username: { startsWith: q } },
          ],
        },
      });
    }),

  getByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });
    }),

  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(30),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.user.findMany({
        take: input.limit,
        where: {
          schoolId: ctx.schoolId,
          isActive: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  count: protectedProcedure
    .input(
      z.object({
        q: z.string().optional(),
      }),
    )
    .query(({ ctx }) => {
      //const qq = `%${input.q}%`;
      return ctx.db.user.count({
        where: {
          schoolId: ctx.schoolId,
          //name: { startsWith: qq, mode: "insensitive" },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.string()), z.string()]))
    .mutation(async ({ input }) => {
      return userService.deleteUsers(Array.isArray(input) ? input : [input]);
    }),

  get: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUniqueOrThrow({
        include: {
          school: true,
        },
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        username: z.string().min(1),
        password: z.string().optional(),
        email: z.string().email().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userExist = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (userExist && userExist.id !== input.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Username is already taken",
        });
      }
      if (input.password) {
        try {
          await ctx.authApi.setUserPassword({
            body: {
              userId: input.id,
              newPassword: input.password,
            },
            headers: await headers(),
          });
        } catch (error) {
          const err = error as Error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to update password ${err.message}`,
          });
        }
      }

      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          username: input.username,
          ...(input.email && { email: input.email }),
          isActive: true,
          ...(input.name && { name: input.name }),
        },
      });
    }),

  getUserByEntityId: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(["staff", "contact", "student"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const entity = await getEntityById({
        entityId: input.entityId,
        entityType: input.entityType,
      });
      let userId = entity.userId;
      if (!userId) {
        const user = await createUser({
          schoolId: ctx.schoolId,
          profile: input.entityType,
          name: entity.name,
          username: `${entity.name.toLowerCase()}.${entity.name.toLowerCase()}`,
          authApi: ctx.authApi,
          entityId: entity.id,
        });
        userId = user.id;
      }
      return { ...entity, userId: userId };
    }),
  getPermissions: protectedProcedure
    .input(z.string().min(1))
    .query(({ input }) => {
      return getPermissions(input);
    }),

  updatePermission: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        action: z.enum(["Read", "Update", "Create", "Delete"]),
        resource: z.string().min(1),
        effect: z.enum(["Allow", "Deny"]),
      }),
    )
    .mutation(({ input }) => {
      return userService.updatePermission({
        userId: input.userId,
        resource: input.resource,
        action: input.action,
        effect: input.effect,
      });
    }),
  subscription: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.subscription.findFirst({
        where: {
          userId: input,
        },
      });
    }),
  activities: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        where: {
          userId: input,
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        entityId: z.string().min(1),
        profile: z.enum(["staff", "contact", "student"]),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return createUser({
        schoolId: ctx.schoolId,
        username: input.username,
        password: input.password,
        profile: input.profile,
        name: input.username,
        email: input.email,
        entityId: input.entityId,
        authApi: ctx.authApi,
      });
    }),
  completeRegistration: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1),
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const isValid = await userService.validateUsername(input.username);
      if (isValid.error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Username is not valid",
        });
      }
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          username: input.username,
          isActive: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
