import type { TRPCRouterRecord } from "@trpc/server";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { generateRandomString, hashPassword } from "better-auth/crypto";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod/v4";

import type { Prisma } from "@repo/db";

import { env } from "../env";
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
        email: z.email().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const entity = await ctx.services.user.getUserByEntity({
        entityId: input.entityId,
        entityType: input.profile,
      });
      // check if the entity has un userId already
      if (entity.userId) {
        // should never happened, we shoud handle this in frontend with update
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cet utilisateur possède deja un compte",
        });
      }
      //check for duplicate
      const exitingUser = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (exitingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${input.username} est déjà utilisé, choisissez un autre nom d'utilisateur`,
        });
      }
      // 1. Create user
      const email = input.email ?? `${input.username}@discolaire.com`;
      const { user: newUser } = await ctx.authApi.createUser({
        body: {
          email,
          password: input.password ?? generateRandomString(12),
          name: entity.name,
          role: "user",
          data: { entityId: entity.id, entityType: entity.entityType },
        },
        // This endpoint requires session cookies.
        headers: await headers(),
      });
      const school = await ctx.db.school.findUniqueOrThrow({
        where: {
          id: ctx.schoolId,
        },
      });
      const org = await ctx.authApi.getFullOrganization({
        query: {
          organizationSlug: school.code,
        },
        headers: await headers(),
      });
      let orgId = org?.id;
      if (!org) {
        const metadata = { schoolId: school.id };
        const newOrg = await ctx.authApi.createOrganization({
          body: {
            name: school.name,
            slug: school.code,
            logo: school.logo ?? undefined,
            metadata,
            keepCurrentActiveOrganization: false,
          },
          // This endpoint requires session cookies.
          headers: await headers(),
        });
        orgId = newOrg?.id;
      }
      if (!orgId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Impossible de créer l'org ${school.code}`,
        });
      }
      // 2. Send invitation
      await ctx.authApi.createInvitation({
        body: {
          email: newUser.email,
          role: "member",
          organizationId: orgId,
          resend: true,
        },
        headers: await headers(),
      });

      await ctx.services.user.attachUser({
        entityType: input.profile,
        entityId: input.entityId,
        userId: newUser.id,
      });

      await ctx.authApi.requestPasswordReset({
        body: {
          email: newUser.email,
          redirectTo: `${env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
        },
        headers: await headers(),
      });

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
      return newUser;
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
        // due to better-auth migration, i needed to create account for existing user
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
        }
        const email = input.email ?? `${input.username}@discolaire.com`;
        await ctx.authApi.requestPasswordReset({
          body: {
            email: email,
            redirectTo: `${env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
          },
          headers: await headers(),
        });
        await ctx.authApi.setUserPassword({
          body: {
            userId: input.id,
            newPassword: input.password,
          },
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
