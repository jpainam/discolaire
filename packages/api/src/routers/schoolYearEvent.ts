import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const schoolYearEventRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.schoolYearEvent.findMany({
      orderBy: {
        date: "asc",
      },
      include: {
        type: true,
      },
      where: {
        schoolYearId: ctx.schoolYearId,
        schoolId: ctx.schoolId,
      },
    });
  }),
  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEvent.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        date: z.coerce.date(),
        typeId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEvent.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          date: input.date,
          typeId: input.typeId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        date: z.coerce.date(),
        typeId: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEvent.create({
        data: {
          name: input.name,
          date: input.date,
          typeId: input.typeId,
          schoolYearId: ctx.schoolYearId,
          schoolId: ctx.schoolId,
        },
      });
    }),

  createEventType: protectedProcedure
    .input(z.object({ name: z.string(), color: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEventType.create({
        data: {
          name: input.name,
          color: input.color,
          schoolId: ctx.schoolId,
        },
      });
    }),
  eventTypes: protectedProcedure.query(({ ctx }) => {
    return ctx.db.schoolYearEventType.findMany({
      orderBy: {
        name: "asc",
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  deleteEventType: protectedProcedure
    .input(z.string().min(1))
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEventType.delete({
        where: {
          id: input,
        },
      });
    }),
  updateEventType: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        color: z.string(),
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.schoolYearEventType.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          color: input.color,
        },
      });
    }),
} satisfies TRPCRouterRecord;
