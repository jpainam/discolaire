import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { ActivityType, DocumentType } from "@repo/db";
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

const activityFilterSchema = z.object({
  entityType: z.enum(["student", "staff", "contact"]),
  entityId: z.string().min(1),
  limit: z.number().min(1).max(100).default(10),
});

const logDownloadSchema = z.object({
  url: z.string().min(1),
});

const resolveDocumentEntity = (doc: {
  studentId?: string | null;
  staffId?: string | null;
  contactId?: string | null;
}) => {
  if (doc.studentId) {
    return { entityType: "student" as const, entityId: doc.studentId };
  }
  if (doc.staffId) {
    return { entityType: "staff" as const, entityId: doc.staffId };
  }
  if (doc.contactId) {
    return { entityType: "contact" as const, entityId: doc.contactId };
  }
  return { entityType: null, entityId: null };
};

const toDocumentLogEntity = (doc: {
  studentId?: string | null;
  staffId?: string | null;
  contactId?: string | null;
  id?: string;
}) => {
  const entity = resolveDocumentEntity(doc);
  if (entity.entityType && entity.entityId) {
    return entity;
  }
  return {
    entityType: "document" as const,
    entityId: doc.id ?? null,
  };
};

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
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      const ids = input;
      return ctx.db.$transaction(async (tx) => {
        const documents = await tx.document.findMany({
          where: {
            id: { in: ids },
            schoolId: ctx.schoolId,
          },
          select: {
            id: true,
            title: true,
            url: true,
            studentId: true,
            staffId: true,
            contactId: true,
          },
        });

        if (documents.length) {
          await ctx.pubsub.logMany(
            documents.map((doc) => {
              const entity = toDocumentLogEntity({ ...doc, id: doc.id });
              return {
                activityType: ActivityType.DOCUMENT,
                action: "deleted",
                entity: entity.entityType,
                entityId: entity.entityId,
                data: {
                  documentId: doc.id,
                  title: doc.title,
                  filename: doc.title ?? doc.url,
                  url: doc.url,
                },
              };
            }),
          );
        }

        return tx.document.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
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
      return ctx.db.$transaction(async (tx) => {
        const document = await tx.document.create({
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

        await ctx.pubsub.log({
          activityType: ActivityType.DOCUMENT,
          action: "uploaded",
          entity: input.entityType,
          entityId: input.entityId,
          data: {
            documentId: document.id,
            title: document.title,
            filename: document.title ?? document.url,
            url: document.url,
          },
        });

        return document;
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
        totalSize: 0,
        totalCount: 0,
        image: { count: 0, size: 0 },
        video: { count: 0, size: 0 },
        document: { count: 0, size: 0 },
        archived: { count: 0, size: 0 },
        other: { count: 0, size: 0 },
      };

      for (const doc of docs) {
        const category = getDocumentFileCategory(doc.mime, doc.url);
        const size = doc.size ?? 0;
        stats.totalSize += size;
        stats.totalCount += 1;
        stats[category].count += 1;
        stats[category].size += size;
      }

      return stats;
    }),
  activities: protectedProcedure
    .input(activityFilterSchema)
    .query(({ ctx, input }) => {
      return ctx.db.logActivity.findMany({
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
        where: {
          schoolId: ctx.schoolId,
          activityType: ActivityType.DOCUMENT,
          entity: input.entityType,
          entityId: input.entityId,
        },
      });
    }),
  logDownload: protectedProcedure
    .input(logDownloadSchema)
    .mutation(async ({ ctx, input }) => {
      const document = await ctx.db.document.findFirst({
        where: {
          url: input.url,
          schoolId: ctx.schoolId,
        },
      });

      if (!document) {
        return null;
      }

      const entity = toDocumentLogEntity({ ...document, id: document.id });
      await ctx.pubsub.log({
        activityType: ActivityType.DOCUMENT,
        action: "downloaded",
        entity: entity.entityType,
        entityId: entity.entityId,
        data: {
          documentId: document.id,
          title: document.title,
          filename: document.title ?? document.url,
          url: document.url,
        },
      });

      return document.id;
    }),
} satisfies TRPCRouterRecord;
