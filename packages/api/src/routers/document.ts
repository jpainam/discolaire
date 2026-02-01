import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { DocumentType } from "@repo/db";
import { getDocumentFileCategory } from "@repo/utils";

import { protectedProcedure } from "../trpc";

const createDocumentSchema = z.object({
  type: z.enum(DocumentType),
  title: z.string().optional(),
  mime: z.string().optional(),
  size: z.number().optional(),
  url: z.string(),
  entityId: z.string(),
  entityType: z.enum(["student", "staff", "contact"]),
});

const updateDocumentSchema = createDocumentSchema
  .partial()
  .extend({ id: z.string().min(1) });

export const documentRouter = {
  all: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["staff", "contact", "student"]).optional(),
        entityId: z.string().optional(),
        limit: z.number().optional().default(20),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.document.findMany({
        include: {
          staff: true,
          student: true,
          contact: true,
          createdBy: true,
        },
        take: input.limit,
        where: {
          ...(input.entityType == "student"
            ? { studentId: input.entityId }
            : {}),
          ...(input.entityType == "contact"
            ? { contactId: input.entityId }
            : {}),
          ...(input.entityType == "staff" ? { staffId: input.entityId } : {}),
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
    .input(updateDocumentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.document.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          type: input.type,
          mime: input.mime,
          size: input.size,
          url: input.url,
          createdById: ctx.session.user.id,
        },
      });
    }),
  create: protectedProcedure
    .input(createDocumentSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.document.create({
        data: {
          type: input.type,
          title: input.title,
          mime: input.mime,
          size: input.size,
          url: input.url,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
          studentId: input.entityType == "student" ? input.entityId : null,
          staffId: input.entityType == "staff" ? input.entityId : null,
          contactId: input.entityType == "contact" ? input.entityId : null,
        },
      });
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.document.findUniqueOrThrow({
      include: {
        student: true,
        staff: true,
        contact: true,
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
          staff: true,
          contact: true,
          student: true,
          createdBy: true,
        },
      });
    }),
  stats: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["student", "staff", "contact"]),
        entityId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const docs = await ctx.db.document.findMany({
        where: {
          studentId: input.entityType == "student" ? input.entityId : null,
          staffId: input.entityType == "staff" ? input.entityId : null,
          contactId: input.entityType == "contact" ? input.entityId : null,
        },
      });

      const stats = {
        image: { count: 0, size: 0 },
        video: { count: 0, size: 0 },
        document: { count: 0, size: 0 },
        archived: { count: 0, size: 0 },
        other: { count: 0, size: 0 },
      };

      for (const doc of docs) {
        const category = getDocumentFileCategory(doc.mime, doc.url);
        stats[category].count += 1;
        stats[category].size += doc.size ?? 0;
      }

      return stats;
    }),
} satisfies TRPCRouterRecord;
