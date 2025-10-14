import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const communicationChannelRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.communicationChannel.findMany({
      include: {
        lastAccessedBy: true,
      },
      where: {
        schoolId: ctx.schoolId,
        schoolYearId: ctx.schoolYearId,
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        classroomId: z.string(),
        type: z.enum(["WHATSAPP", "SMS", "EMAIL", "TELEGRAM", "OTHER"]),
        url: z.string().url(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.communicationChannel.create({
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          classroomId: input.classroomId,
          url: input.url,
          schoolId: ctx.schoolId,
          schoolYearId: ctx.schoolYearId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["WHATSAPP", "SMS", "EMAIL", "TELEGRAM", "OTHER"]),
        url: z.string().url(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.communicationChannel.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          type: input.type,
          url: input.url,
        },
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.communicationChannel.delete({
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
