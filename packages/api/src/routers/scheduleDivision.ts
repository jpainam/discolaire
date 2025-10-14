import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const scheduleDivisionRouter = {
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
        monday: z.boolean().default(false),
        tuesday: z.boolean().default(false),
        wednesday: z.boolean().default(false),
        thursday: z.boolean().default(false),
        friday: z.boolean().default(false),
        saturday: z.boolean().default(false),
        sunday: z.boolean().default(false),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleDivision.create({
        data: {
          schoolYearId: ctx.schoolYearId,
          name: input.name,
          monday: input.monday,
          tuesday: input.tuesday,
          wednesday: input.wednesday,
          thursday: input.thursday,
          friday: input.friday,
          saturday: input.saturday,
          sunday: input.sunday,
          startTime: input.startTime,
          endTime: input.endTime,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleDivision.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        startTime: z.coerce.date(),
        endTime: z.coerce.date(),
        monday: z.boolean().default(false),
        tuesday: z.boolean().default(false),
        wednesday: z.boolean().default(false),
        thursday: z.boolean().default(false),
        friday: z.boolean().default(false),
        saturday: z.boolean().default(false),
        sunday: z.boolean().default(false),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.scheduleDivision.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          monday: input.monday,
          tuesday: input.tuesday,
          wednesday: input.wednesday,
          thursday: input.thursday,
          friday: input.friday,
          saturday: input.saturday,
          sunday: input.sunday,
          endTime: input.endTime,
          startTime: input.startTime,
        },
      });
    }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.scheduleDivision.findMany({
      orderBy: {
        startTime: "asc",
      },
      where: {
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
} satisfies TRPCRouterRecord;
