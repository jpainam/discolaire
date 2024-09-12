import { z } from "zod";

import { encryptPassword } from "../encrypt";
import { userService } from "../services/user-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
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
      where: {
        id: input,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        avatar: z.string().optional(),
        password: z.string().min(6),
        emailVerified: z.coerce.date().optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          email: input.email,
          name: input.name,
          avatar: input.avatar,
          password: await encryptPassword(input.password),
          emailVerified: input.emailVerified,

          isActive: input.isActive,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().min(1),
        description: z.string().min(1),
        amount: z.number().min(1),
        dueDate: z.date(),
        journalId: z.number(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fee.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          description: input.description,
          amount: input.amount,
          dueDate: input.dueDate,
          journal: { connect: { id: input.journalId } },
          isActive: input.isActive,
        },
      });
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
});
