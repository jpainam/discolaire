import type { TRPCRouterRecord } from "@trpc/server";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { hashPassword } from "better-auth/crypto";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  search: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(130),
        query: z.string().optional().default(""),
        roleId: z.string().optional(),
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
          ...(input.roleId ? { userRoleId: input.roleId } : {}),
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
        pageSize: z.number().int().min(1).max(200).optional().default(30),
        cursor: z.string().nullish(),
        search: z.string().optional().default(""),
        filters: z
          .array(
            z.object({
              id: z.string().min(1),
              value: z.union([z.string(), z.array(z.string())]).optional(),
            }),
          )
          .optional()
          .default([]),
        sorting: z
          .array(
            z.object({
              id: z.string().min(1),
              desc: z.boolean().optional().default(false),
            }),
          )
          .optional()
          .default([]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const search = input.search.trim();

      const profileFilter = input.filters.find(
        (filter) => filter.id === "profile",
      );
      const profileValues = Array.isArray(profileFilter?.value)
        ? profileFilter.value
        : profileFilter?.value
          ? [profileFilter.value]
          : [];

      const where: Prisma.UserWhereInput = {
        schoolId: ctx.schoolId,
        isActive: true,
        ...(search
          ? {
              OR: [
                {
                  username: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  profile: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
        ...(profileValues.length
          ? {
              profile: {
                in: profileValues,
              },
            }
          : {}),
      };

      const sortableFields = new Set([
        "username",
        "name",
        "email",
        "profile",
        "createdAt",
      ]);

      const orderBy = input.sorting
        .filter((sort) => sortableFields.has(sort.id))
        .map((sort) => ({
          [sort.id]: sort.desc ? "desc" : "asc",
        }));

      const resolvedOrderBy =
        orderBy.length > 0 ? orderBy : [{ createdAt: "desc" }, { id: "desc" }];

      if (!resolvedOrderBy.some((order) => "id" in order)) {
        resolvedOrderBy.push({ id: "desc" });
      }

      const take = input.pageSize + 1;

      const [rowCount, data] = await ctx.db.$transaction([
        ctx.db.user.count({ where }),
        ctx.db.user.findMany({
          where,
          orderBy: resolvedOrderBy,
          take,
          ...(input.cursor
            ? {
                cursor: { id: input.cursor },
                skip: 1,
              }
            : {}),
        }),
      ]);
      console.log(">>>>>>>>>>>>>>>>>>>");
      console.log(rowCount, data.length);

      const hasNextPage = data.length > input.pageSize;
      const items = hasNextPage ? data.slice(0, -1) : data;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;
      console.log(">>>>>>>>>>>>.2");
      console.log(">>>>>", items.length, rowCount, nextCursor);
      return { data: items, rowCount, nextCursor };
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
        email: z.email().optional().or(z.literal("")),
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
            await ctx.authApi.requestPasswordReset({
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
        action: z.enum(["read", "update", "create", "delete"]),
        resource: z.string().min(1),
        effect: z.enum(["allow", "deny"]),
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
      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: input,
        },
      });
      const entity = await ctx.services.user.getEntity(
        user.id,
        user.profile as "student" | "contact" | "staff",
      );
      if (!entity.entityId) {
        return null;
      }
      return ctx.db.notificationSubscription.findFirst({
        where: {
          entityId: entity.entityId,
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
        await ctx.authApi.requestPasswordReset({
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
        profile: z.enum(["student", "contact", "staff"]),
        avatar: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.profile == "student") {
        await ctx.db.student.update({
          data: {
            avatar: input.avatar,
          },
          where: { id: input.id },
        });
      } else if (input.profile == "contact") {
        await ctx.db.contact.update({
          data: {
            avatar: input.avatar,
          },
          where: { id: input.id },
        });
      } else {
        await ctx.db.staff.update({
          data: {
            avatar: input.avatar,
          },
          where: { id: input.id },
        });
      }
      return true;
    }),
} satisfies TRPCRouterRecord;
