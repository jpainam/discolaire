import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { encryptPassword } from "../encrypt";
import { userService } from "../services/user-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  updatePassword: protectedProcedure
    .input(z.object({ userId: z.string(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          password: await encryptPassword(input.password),
        },
      });
    }),
  all: protectedProcedure
    .input(
      z.object({
        pageSize: z.number().default(30),
        q: z.string().optional(),
        pageIndex: z.number().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      const offset = input.pageSize * input.pageIndex;
      const qq = `%${input.q}%`;
      return ctx.db.user.findMany({
        skip: offset,
        take: input.pageSize,
        where: {
          schoolId: ctx.schoolId,
          name: { startsWith: qq, mode: "insensitive" },
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
    .query(({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.user.count({
        where: {
          schoolId: ctx.schoolId,
          name: { startsWith: qq, mode: "insensitive" },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.string()), z.string()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
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
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.user.findUnique({
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
        emailVerified: z.coerce.date().optional(),
        isActive: z.boolean().default(true),
        roleId: z.array(z.string().min(1)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: {
          email: `${input.username}@discolaire.com`,
          username: input.username,
          name: input.username,
          schoolId: ctx.schoolId,
          password: await encryptPassword(input.password),
          emailVerified: input.emailVerified,
          isActive: input.isActive,
        },
      });
      await userService.attachRoles(user.id, input.roleId);
      return user;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1),
        isActive: z.boolean().default(true),
        roleId: z.array(z.string().min(1)),
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
          code: "BAD_REQUEST",
          message: "User with this username already exists",
        });
      }
      const user = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          username: input.username,
          password: await encryptPassword(input.password),
          isActive: input.isActive,
        },
      });
      await userService.attachRoles(user.id, input.roleId);
      return user;
    }),
  permissions: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return userService.getPermissions(userId);
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

  attachUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        entityId: z.string(),
        type: z.enum(["staff", "contact", "student"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let email: string | null;
      let name = "";
      let avatar: string | null;

      if (input.type === "staff") {
        const d = await ctx.db.staff.update({
          where: {
            id: input.entityId,
          },
          data: {
            user: {
              connect: {
                id: input.userId,
              },
            },
          },
        });
        email = d.email;
        name = `${d.lastName} ${d.firstName}`;
        avatar = d.avatar;
      } else if (input.type === "contact") {
        const d = await ctx.db.contact.update({
          where: {
            id: input.entityId,
          },
          data: {
            user: {
              connect: {
                id: input.userId,
              },
            },
          },
        });
        email = d.email;
        name = `${d.lastName} ${d.firstName}`;
        avatar = d.avatar;
      } else {
        const d = await ctx.db.student.update({
          where: {
            id: input.entityId,
          },
          data: {
            user: {
              connect: {
                id: input.userId,
              },
            },
          },
        });
        email = d.email;
        name = `${d.lastName} ${d.firstName}`;
        avatar = d.avatar;
      }
      return userService.updateProfile(input.userId, name, email, avatar);
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
      console.log(input.oldPassword, user.password);
      console.log(await encryptPassword(input.oldPassword));
      if (!(await bcrypt.compare(input.oldPassword, user.password))) {
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
          password: await encryptPassword(input.newPassword),
        },
      });
    }),
});
