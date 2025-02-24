import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().min(1),
  ownerId: z.string().min(1),
});

export const documentRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdBy: true,
        owner: true,
      },
      where: {
        schoolId: ctx.schoolId,
      },
    });
  }),
  byUserId: protectedProcedure
    .input(z.object({ ownerId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.document.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          createdBy: true,
          owner: true,
        },
        where: {
          ownerId: input.ownerId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(({ ctx, input }) => {
      return ctx.db.document.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
        },
      });
    }),
  update: protectedProcedure
    .input(createEditDocumentSchema.extend({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.document.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          url: input.url,
          createdById: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(createEditDocumentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.document.create({
        data: {
          title: input.title,
          description: input.description,
          ownerId: input.ownerId,
          url: input.url,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.document.findUnique({
      include: {
        owner: true,
        createdBy: true,
      },
      where: {
        id: input,
      },
    });
  }),
});
