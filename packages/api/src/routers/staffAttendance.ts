import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const staffAttendanceRouter = {
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        // query: z.string().optional(),
        date: z.date().optional(),
        staffId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //const q = input.query;
      return ctx.db.staffAttendance.findMany({
        take: input.limit,
        where: {
          ...(input.date ? { date: input.date } : {}),
          ...(input.staffId ? { staffId: input.staffId } : {}),
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        staffId: z.string(),
        date: z.date().optional().default(new Date()),
        startDate: z.date(),
        endDate: z.date(),
        status: z.enum(["in_mission"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.staffAttendance.create({
        data: input,
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        staffId: z.string(),
        date: z.date().optional().default(new Date()),
        startDate: z.date(),
        endDate: z.date(),
        status: z.enum(["in_mission"]),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.staffAttendance.update({
        where: {
          id,
        },
        data: data,
      });
    }),
} satisfies TRPCRouterRecord;
