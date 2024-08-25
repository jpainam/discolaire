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
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.policy.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(
      createUpdateSchema.extend({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.policy.update({
        where: {
          id: id,
        },
        data: data,
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.array(z.number()), z.number()]))
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
