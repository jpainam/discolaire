import type { TRPCRouterRecord } from "@trpc/server";
import { headers } from "next/headers";
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
          ...(input.roleId
            ? {
                userRoles: {
                  some: {
                    roleId: input.roleId,
                  },
                },
              }
            : {}),
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
          include: {
            userRoles: {
              select: {
                role: true,
              },
            },
          },
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

      const hasNextPage = data.length > input.pageSize;
      const items = hasNextPage ? data.slice(0, -1) : data;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;

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

  getPermissions: protectedProcedure
    .input(z.string().min(1))
    .query(({ input, ctx }) => {
      return ctx.services.user.getPermissions(input);
    }),

  updatePermission: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
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
      const entity = await ctx.services.user.getEntityFromUser(
        user.id,
        user.profile as "student" | "contact" | "staff",
      );
      if (!entity.entityId) {
        return null;
      }
      const recipient = await ctx.services.notification.ensureRecipient({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: entity.entityId,
          profile: entity.entityType,
        },
      });
      return ctx.db.notificationSubscription.findFirst({
        where: {
          recipientId: recipient.id,
          schoolId: ctx.schoolId,
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
        email: z.email().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const requestHeaders = await headers();
      return ctx.services.user.createUser({
        input,
        authApi: ctx.authApi,
        requestHeaders,
        schoolId: ctx.schoolId,
        pubsub: ctx.pubsub,
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
      const requestHeaders = await headers();
      return ctx.services.user.updateUser({
        input,
        authApi: ctx.authApi,
        requestHeaders,
        pubsub: ctx.pubsub,
      });
    }),

  getUserFromEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(["staff", "contact", "student"]),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.services.user.getUserFromEntity({
        entityId: input.entityId,
        entityType: input.entityType,
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
