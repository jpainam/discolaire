import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getUserByEntity } from "../services/user-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  attachments: z.array(z.string()).optional().default([]),
  userId: z.string().optional(),
  entityId: z.string().optional(),
  entityType: z.enum(["student", "staff", "contact"]).optional(),
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
      let userId = input.userId;
      if (!userId) {
        if (!input.entityId || !input.entityType) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "entityId and entityType are required",
          });
        }
        const user = await getUserByEntity({
          entityId: input.entityId,
          entityType: input.entityType,
          schoolId: ctx.schoolId,
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
});
