import { z } from "zod";

import { getUserByEntity } from "../services/user-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  attachments: z.array(z.string()).optional().default([]),
  entityId: z.string().min(1),
  entityType: z.enum(["student", "staff", "contact"]),
});

export const documentRouter = createTRPCRouter({
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
          //attachments: input.attachments,
          createdById: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(createEditDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getUserByEntity({
        entityId: input.entityId,
        entityType: input.entityType,
        schoolId: ctx.schoolId,
      });
      return ctx.db.document.create({
        data: {
          title: input.title,
          description: input.description,
          userId: user.id,
          attachments: input.attachments,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.document.findUniqueOrThrow({
      include: {
        user: true,
        createdBy: true,
      },
      where: {
        id: input,
      },
    });
  }),
  latest: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.document.findMany({
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          createdBy: true,
        },
      });
    }),
});
