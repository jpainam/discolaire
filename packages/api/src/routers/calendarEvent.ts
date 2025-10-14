import type { TRPCRouterRecord } from "@trpc/server";
import { addMonths } from "date-fns";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  title: z.string(),
  description: z.string(),
  start: z.date(),
  end: z.date(),
  repeat: z.string(),
  alert: z.string(),
  data: z.any().optional(),
});
export const calendarEventRouter = {
  all: protectedProcedure
    .input(
      z.object({
        start: z.coerce.date().optional().default(addMonths(new Date(), -2)),
        end: z.coerce.date().optional().default(addMonths(new Date(), 3)),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.calendarEvent.findMany({
        include: {
          calendarType: true,
        },
        where: {
          start: {
            gte: input.start,
          },
          end: {
            lte: input.end,
          },
        },
      });
    }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.calendarEvent.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.calendarEvent.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.calendarEvent.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
