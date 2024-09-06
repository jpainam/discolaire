import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  effect: z.enum(["Allow", "Deny"]),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  condition: z.any(),
});
export const policyRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.policy.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.policy.findUnique({
      where: {
        id: input,
      },
    });
  }),
  attachToUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        policyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userPolicy.create({
        data: {
          userId: input.userId,
          policyId: input.policyId,
          createdById: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.policy.create({
        data: { ...input, createdBy: ctx.session.user.id },
      });
    }),
  update: protectedProcedure
    .input(
      createUpdateSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.policy.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          updatedBy: ctx.session.user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.string()), z.string()]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.policy.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
});
