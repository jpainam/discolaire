import { z } from "zod";

import { encryptPassword } from "../encrypt";
import { userService } from "../services/user-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.delete({ where: { id: input.id } });
    }),
  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.deleteMany({
        where: {
          id: {
            in: input.ids,
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
        isEmailVerified: z.boolean().default(false),
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
          isEmailVerified: input.isEmailVerified,

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
  permissions: protectedProcedure.query(async ({ ctx }) => {
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
