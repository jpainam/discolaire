// const createUpdateGroupSchema = z.object({
//   name: z.string().min(1),
// });
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const permissionRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.permission.findMany({
      include: {
        group: true,
      },
    });
  }),
  groups: protectedProcedure.query(({ ctx }) => {
    return ctx.db.recipientGroup.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipient.create({
        data: {
          userId: input.userId,
          groupId: input.groupId,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.groupId) {
        return ctx.db.recipient.delete({
          where: {
            groupId_userId: {
              groupId: input.groupId,
              userId: input.userId,
            },
          },
        });
      }
      return ctx.db.recipient.deleteMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  deleteGroup: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ input, ctx }) => {
      return ctx.db.recipientGroup.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.recipientGroup.create({
        data: {
          name: input.name,
        },
      });
    }),
  updateGroup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.recipientGroup.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
} satisfies TRPCRouterRecord;
