import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createFinanceGroupSchema = z.object({
  name: z.string(),
  value: z.number().min(1),
  type: z.enum(["AMOUNT", "PERCENT"]).default("AMOUNT"),
});
export const accountingRouter = createTRPCRouter({
  groups: protectedProcedure.query(({ ctx }) => {
    return ctx.db.accountingGroup.findMany({
      include: {
        createdBy: true,
      },
      where: {
        schoolYearId: ctx.schoolYearId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  deleteGroup: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingGroup.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  updateGroup: protectedProcedure
    .input(createFinanceGroupSchema.extend({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingGroup.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          type: input.type,
          value: input.value,
          createdById: ctx.session.user.id,
        },
      });
    }),
  createGroup: protectedProcedure
    .input(createFinanceGroupSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.accountingGroup.create({
        data: {
          name: input.name,
          type: input.type,
          value: input.value,
          schoolYearId: ctx.schoolYearId,
          createdById: ctx.session.user.id,
        },
      });
    }),
});
