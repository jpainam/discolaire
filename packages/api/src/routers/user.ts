import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  attachUser,
  getEntityById,
  getPermissions,
  userService,
} from "../services/user-service";
import { protectedProcedure, publicProcedure } from "../trpc";

const MAX_ATTEMPTS = 5;

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
  roles: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.userRole.findMany({
        include: {
          role: true,
        },
        where: {
          userId: input.userId,
        },
      });
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
  create: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        entityId: z.string().min(1),
        emailVerified: z.coerce.date().optional(),
        isActive: z.boolean().default(true),
        profile: z.enum(["staff", "contact", "student"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await userService.validateUsername(input.username);
      if (exists.error) {
        throw new TRPCError({
          message: exists.error,
          code: "FORBIDDEN",
        });
      }

      const session = await ctx.authApi.signUpEmail({
        body: {
          email: `${input.username}@discolaire.com`,
          password: input.password,
          profile: input.profile,
          schoolId: ctx.schoolId,
          username: input.username,
          name: input.username,
          isActive: input.isActive,
        },
      });
      const { email, name } = await attachUser({
        entityId: input.entityId,
        entityType: input.profile,
        userId: session.user.id,
      });
      return ctx.db.user.update({
        where: { id: session.user.id },
        data: {
          name,
          email,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        username: z.string().min(1),
        name: z.string().optional(),
        email: z.string().optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findFirst({
        where: {
          username: input.username,
          id: {
            not: input.id,
          },
        },
      });
      if (existingUser) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User with this username already exists",
        });
      }

      const user = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          username: input.username,
          ...(input.name ? { name: input.name } : {}),
          ...(input.email ? { email: input.email } : {}),
          isActive: input.isActive,
        },
      });
      return user;
      // if (input.email && input.email != user.email) {
      //   await ctx.authApi.changeEmail({
      //     userId: user.id,
      //     body: {
      //       email: input.username ?? "",
      //     },
      //   });
      // }
    }),
  createAutoUser: protectedProcedure
    .input(
      z.object({
        entityId: z.string().min(1),
        entityType: z.enum(["staff", "contact", "student"]),
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return userService.createAutoUser({
        schoolId: ctx.schoolId,
        profile: input.entityType,
        name: input.name,
        entityId: input.entityId,
        authApi: ctx.authApi,
      });
    }),
  getUserByEntityId: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(["staff", "contact", "student"]),
      }),
    )
    .query(async ({ input }) => {
      return getEntityById({
        entityId: input.entityId,
        entityType: input.entityType,
      });
    }),
  getPermissions: protectedProcedure
    .input(z.string().min(1))
    .query(({ input }) => {
      return getPermissions(input);
    }),

  signUp: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        token: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.invite.findUnique({
        where: {
          token: input.token,
        },
      });
      if (!invite || invite.used || new Date(invite.expiresAt) < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid, expired invite or used token",
        });
      }

      if (invite.attempts >= MAX_ATTEMPTS) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Too many failed attempts, contact support",
        });
      }

      const exists = await userService.validateUsername(input.username);
      if (exists.error) {
        throw new TRPCError({
          message: exists.error,
          code: "FORBIDDEN",
        });
      }
      const session = await ctx.authApi.signUpEmail({
        body: {
          email: `${input.username}@discolaire.com`,
          username: input.username,
          name: input.username,
          profile: invite.entityType,
          schoolId: invite.schoolId,
          password: input.password,
          isActive: true,
        },
      });
      await ctx.db.invite.update({
        where: { token: input.token },
        data: {
          attempts: 0,
          used: true,
          lastAttempt: new Date(),
        },
      });
      await attachUser({
        entityId: invite.entityId,
        entityType: invite.entityType as "staff" | "contact" | "student",
        userId: session.user.id,
      });

      return session.user;
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
} satisfies TRPCRouterRecord;
