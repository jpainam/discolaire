import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const createUpdateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().url().optional().or(z.literal("")),
  from: z.coerce.date(),
  to: z.coerce.date(),
  level: z.string().min(1),
  recipients: z.array(z.string()),
});

export const announcementRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  get: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.announcement.findUnique({
      where: {
        id: input,
      },
    });
  }),
  create: protectedProcedure
    .input(createUpdateSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.announcement.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(createUpdateSchema.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.announcement.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.number(), z.array(z.number())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.announcement.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  findActives: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const notices = await ctx.db.announcement.findMany({
      where: {
        from: {
          lte: today,
        },
        to: {
          gte: today,
        },
      },
    });

    return notices.map((notice) => ({
      id: notice.id,
      title: notice.title,
      description: notice.description,
      link: notice.link,
      level: notice.level,
    }));
  }),
} satisfies TRPCRouterRecord;
