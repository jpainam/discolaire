import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const shortcutRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.shortcut.upsert({
        where: {
          userId_url_schoolId: {
            url: input.url,
            userId: ctx.session.user.id,
            schoolId: ctx.schoolId,
          },
        },
        update: {
          title: input.title,
          url: input.url,
        },
        create: {
          title: input.title,
          url: input.url,
          userId: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
        id: z.coerce.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.shortcut.update({
        data: {
          title: input.title,
          url: input.url,
        },
        where: {
          id: input.id,
          userId: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.coerce.number())
    .mutation(({ ctx, input }) => {
      return ctx.db.shortcut.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().default(""),
        limit: z.number().int().optional().default(10),
      }),
    )
    .query(({ ctx, input }) => {
      const qq = `${input.query.trim()}%`;
      return ctx.db.shortcut.findMany({
        take: input.limit,
        where: {
          userId: ctx.session.user.id,
          schoolId: ctx.schoolId,
          OR: [
            {
              title: {
                startsWith: qq,
                mode: "insensitive",
              },
            },
            {
              url: {
                startsWith: qq,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
