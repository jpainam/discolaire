import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

export const formerShoolRouter = {
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional().default(""),
        pageSize: z.number().int().min(1).max(200).optional().default(30),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const search = input.search.trim();
      const where = {
        schoolId: ctx.schoolId,
        ...(search
          ? { name: { contains: search, mode: "insensitive" as const } }
          : {}),
      };

      const take = input.pageSize + 1;

      const [rowCount, data] = await ctx.db.$transaction([
        ctx.db.formerSchool.count({ where }),
        ctx.db.formerSchool.findMany({
          orderBy: { name: "asc" },
          take,
          where,
          ...(input.cursor
            ? { cursor: { id: input.cursor }, skip: 1 }
            : {}),
        }),
      ]);

      const hasNextPage = data.length > input.pageSize;
      const items = hasNextPage ? data.slice(0, -1) : data;
      const nextCursor = hasNextPage ? (items[items.length - 1]?.id ?? null) : null;

      return { data: items, rowCount, nextCursor };
    }),
  merge: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        ids: z.array(z.string()).min(2),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newSchool = await ctx.db.formerSchool.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });

      await ctx.db.student.updateMany({
        where: { formerSchoolId: { in: input.ids } },
        data: { formerSchoolId: newSchool.id },
      });

      await ctx.db.formerSchool.deleteMany({
        where: { id: { in: input.ids } },
      });

      return newSchool;
    }),
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.formerSchool.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
  search: protectedProcedure
    .input(z.object({ q: z.string().default("") }))
    .query(({ ctx, input }) => {
      const qq = `%${input.q}%`;
      return ctx.db.formerSchool.findMany({
        take: 10,
        where: {
          schoolId: ctx.schoolId,
          name: {
            contains: qq,
            mode: "insensitive",
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.formerSchool.create({
        data: {
          name: input.name,
          schoolId: ctx.schoolId,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.formerSchool.findUnique({
      where: {
        id: input,
      },
    });
  }),
} satisfies TRPCRouterRecord;
