import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { createUser, getEntityById } from "../services/user-service";
import { protectedProcedure } from "../trpc";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  attachments: z.array(z.string()).optional().default([]),
  entityId: z.string().min(1),
  entityType: z.enum(["student", "staff", "contact"]),
});

export const documentRouter = {
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
      const entity = await getEntityById({
        entityId: input.entityId,
        entityType: input.entityType,
      });
      let userId = entity.userId;
      if (!userId) {
        const user = await createUser({
          schoolId: ctx.schoolId,
          profile: input.entityType,
          name: entity.name,
          username: `${entity.name.toLowerCase()}.${entity.name.toLowerCase()}`,
          authApi: ctx.authApi,
          entityId: entity.id,
        });
        userId = user.id;
      }
      return ctx.db.document.create({
        data: {
          title: input.title,
          description: input.description,
          userId: userId,
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
} satisfies TRPCRouterRecord;
