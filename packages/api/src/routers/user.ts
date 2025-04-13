import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { comparePasswords, hashPassword } from "@repo/auth/session";

import { ratelimiter } from "../rateLimit";
import {
  attachUser,
  getPermissions,
  userService,
} from "../services/user-service";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const MAX_ATTEMPTS = 5;

export const userRouter = createTRPCRouter({
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
    .use(ratelimiter({ limit: 5, namespace: "getByEmail.password" }))
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
  updatePassword: protectedProcedure
    .input(z.object({ userId: z.string(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isActive: true,
          password: await hashPassword(input.password),
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
      const user = await ctx.db.user.create({
        data: {
          email: `${input.username}@discolaire.com`,
          username: input.username,
          name: input.username,
          profile: input.profile,
          schoolId: ctx.schoolId,
          password: await hashPassword(input.password),
          emailVerified: input.emailVerified,
          isActive: input.isActive,
        },
      });
      const { email, name } = await attachUser({
        entityId: input.entityId,
        entityType: input.profile,
        userId: user.id,
      });
      return ctx.db.user.update({
        where: { id: user.id },
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
        password: z.string().optional(),
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
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          username: input.username,
          ...(input.name ? { name: input.name } : {}),
          ...(input.email ? { email: input.email } : {}),
          ...(input.password
            ? { password: await hashPassword(input.password) }
            : {}),
          isActive: input.isActive,
        },
      });
    }),
  updateAvatar: protectedProcedure
    .input(z.object({ id: z.string(), avatar: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id, schoolId: ctx.schoolId },
        data: {
          avatar: input.avatar,
        },
      });
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
      });
    }),
  getUserByEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(["staff", "contact", "student"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      let userId, name;
      if (input.entityType == "staff") {
        const dd = await ctx.db.staff.findUniqueOrThrow({
          where: {
            id: input.entityId,
          },
        });
        userId = dd.userId;
        name = `${dd.lastName} ${dd.firstName}`;
      } else if (input.entityType == "student") {
        const dd = await ctx.db.student.findFirstOrThrow({
          where: {
            id: input.entityId,
          },
        });
        userId = dd.userId;
        name = `${dd.lastName} ${dd.firstName}`;
      } else {
        const dd = await ctx.db.contact.findFirstOrThrow({
          where: {
            id: input.entityId,
          },
        });
        userId = dd.userId;
        name = `${dd.lastName} ${dd.firstName}`;
      }
      if (!userId) {
        return userService.createAutoUser({
          schoolId: ctx.schoolId,
          entityId: input.entityId,
          profile: input.entityType,
          name: name,
        });
      }
      return ctx.db.user.findFirstOrThrow({
        where: {
          id: userId,
        },
      });
    }),
  getPermissions: protectedProcedure
    .input(z.string().min(1))
    .query(({ input }) => {
      return getPermissions(input);
    }),

  attachPolicy: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(() => {
      return [];
    }),

  updateMyPassword: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string().min(1),
        newPassword: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!(await comparePasswords(input.oldPassword, user.password))) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Old password is incorrect",
        });
      }
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: await hashPassword(input.newPassword),
        },
      });
    }),
  loginActivities: protectedProcedure
    .input(z.object({ userIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.loginActivity.findMany({
        take: 10,
        where: {
          userId: {
            in: input.userIds,
          },
        },
        include: {
          user: true,
        },
        orderBy: {
          loginDate: "desc",
        },
      });
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
      const user = await ctx.db.user.create({
        data: {
          email: `${input.username}@discolaire.com`,
          username: input.username,
          name: input.username,
          profile: invite.entityType,
          schoolId: invite.schoolId,
          password: await hashPassword(input.password),
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
        userId: user.id,
      });

      return user;
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
});
