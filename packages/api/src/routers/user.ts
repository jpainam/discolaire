import type { TRPCRouterRecord } from "@trpc/server";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "better-auth/crypto";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  search: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(130),
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
    .mutation(async ({ input, ctx }) => {
      const userIds = Array.isArray(input) ? input : [input];
      await ctx.pubsub.publish("user", {
        type: "delete",
        data: {
          id: userIds.join(","),
        },
      });
      return ctx.services.user.deleteUsers(userIds);
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
        email: z.string().email().optional().or(z.literal("")),
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
          message: `Le nom utilisateur ${input.username} est déjà pris, choisissez-en un autre.`,
        });
      }
      if (input.password) {
        const account = await ctx.db.account.findFirst({
          where: {
            userId: input.id,
            providerId: "credential",
          },
        });
        if (!account) {
          await ctx.db.account.create({
            data: {
              id: uuidv4(),
              userId: input.id,
              accountId: input.id,
              providerId: "credential",
              password: await hashPassword(input.password),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          if (input.email)
            await ctx.authApi.forgetPassword({
              body: {
                email: input.email,
                redirectTo: `/auth/complete-registration/${input.id}`,
              },
              headers: await headers(),
            });
        }
        await ctx.authApi.setUserPassword({
          body: {
            userId: input.id,
            newPassword: input.password,
          },
          // TODO this is bad. I should not get the headers from next, keep api away from next
          headers: await headers(),
        });
      }

      await ctx.db.user.update({
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
      if (input.email && userExist?.email !== input.email) {
        await ctx.authApi.sendVerificationEmail({
          body: {
            email: input.email,
          },
          headers: await headers(),
        });
      }
      await ctx.pubsub.publish("user", {
        type: "update",
        data: {
          id: input.id,
          metadata: {
            name: input.name,
          },
        },
      });
      return ctx.db.user.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
    }),
  getPermissions: protectedProcedure
    .input(z.string().min(1))
    .query(({ input, ctx }) => {
      return ctx.services.user.getPermissions(input);
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
    .mutation(async ({ ctx, input }) => {
      await ctx.pubsub.publish("permission", {
        type: "update",
        data: {
          id: input.userId,
          metadata: {
            resource: input.resource,
            effect: input.effect,
          },
        },
      });
      return ctx.services.user.updatePermission({
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
  create: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().optional(),
        entityId: z.string().min(1),
        profile: z.enum(["staff", "contact", "student"]),
        email: z.string().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.pubsub.publish("user", {
        type: "create",
        data: {
          id: input.entityId,
          metadata: {
            profile: input.profile,
            entityId: input.entityId,
          },
        },
      });
      return ctx.services.user.createUser({
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
  invite: protectedProcedure
    .input(
      z.object({
        entityId: z.string().min(1),
        entityType: z.enum(["staff", "student", "contact"]),
        email: z.string().min(1).email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const entity = await ctx.services.user.getByEntity({
        entityId: input.entityId,
        entityType: input.entityType,
      });
      if (!entity.userId) {
        await ctx.services.user.createUser({
          schoolId: ctx.schoolId,
          username: entity.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(),
          profile: input.entityType,
          name: entity.name,
          email: input.email,
          entityId: input.entityId,
          authApi: ctx.authApi,
        });
      } else {
        await ctx.authApi.forgetPassword({
          body: {
            email: input.email,
            redirectTo: `/auth/complete-registration/${entity.userId}`,
          },
          headers: await headers(),
        });
      }
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
      const isValid = await ctx.services.user.validateUsername(input.username);
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
  createApiKey: protectedProcedure.query(async ({ ctx }) => {
    const apiKey = await ctx.authApi.createApiKey({
      body: {
        name: `API Key for ${ctx.session.user.name}`,
        rateLimitEnabled: true,
        rateLimitTimeWindow: 1000 * 60 * 60 * 24, // 1 day
        rateLimitMax: 10000, // 10k requests per day
        userId: ctx.session.user.id,
      },
      headers: await headers(),
    });
    console.log("API Key created for student:", apiKey);
  }),
  updateAvatar: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        avatar: z.string().nullish(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          avatar: input.avatar,
        },
      });
    }),
} satisfies TRPCRouterRecord;
