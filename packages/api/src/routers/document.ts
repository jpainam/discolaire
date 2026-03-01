import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { DocumentType } from "@repo/db";
import { getDocumentFileCategory } from "@repo/utils";

import { ActivityAction, ActivityTargetType } from "../activity-logger";
import { protectedProcedure } from "../trpc";

const createDocumentSchema = z.object({
  type: z.enum(DocumentType),
  title: z.string().min(1),
  description: z.string().min(1),
  mime: z.string().optional(),
  size: z.number().optional(),
  url: z.string(),
  entityId: z.string(),
  entityType: z.enum(["student", "staff", "contact", "classroom"]),
});

const updateDocumentSchema = createDocumentSchema
  .partial()
  .extend({ id: z.string().min(1) });

const activityFilterSchema = z.object({
  entityType: z.enum(["student", "staff", "contact", "classroom"]),
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
  classroomId?: string | null;
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
  if (doc.classroomId) {
    return { entityType: "classroom" as const, entityId: doc.classroomId };
  }
  return { entityType: null, entityId: null };
};

const toDocumentLogEntity = (doc: {
  studentId?: string | null;
  staffId?: string | null;
  contactId?: string | null;
  classroomId?: string | null;
  id?: string;
}) => {
  const entity = resolveDocumentEntity(doc);
  if (entity.entityType && entity.entityId) {
    return { targetType: entity.entityType, targetId: entity.entityId };
  }
  return {
    targetType: "document" as const,
    targetId: doc.id ?? null,
  };
};

export const documentRouter = {
  all: protectedProcedure
    .input(
      z.object({
        entityType: z
          .enum(["staff", "contact", "student", "classroom"])
          .optional(),
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
          classroom: true,
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
          ...(input.entityType == "classroom"
            ? { classroomId: input.entityId }
            : {}),
        },
      });
    }),
  delete: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      const ids = input;
      const documents = await ctx.db.document.findMany({
        where: { id: { in: ids }, schoolId: ctx.schoolId },
        select: {
          id: true,
          title: true,
          url: true,
          studentId: true,
          staffId: true,
          contactId: true,
          classroomId: true,
        },
      });
      const result = await ctx.db.document.deleteMany({
        where: { id: { in: ids } },
      });
      if (documents.length) {
        ctx.activityLog.logMany(
          documents.map((doc) => {
            const entity = toDocumentLogEntity({ ...doc, id: doc.id });
            const filename = doc.title ?? doc.url;
            return {
              action: ActivityAction.DELETE,
              targetType: entity.targetType as ActivityTargetType,
              targetId: entity.targetId,
              description: `${ctx.activityLog.actor} a supprimé le document <strong>${filename}</strong>`,
              metadata: { documentTitle: filename, actorName: ctx.activityLog.actor },
            };
          }),
        );
      }
      return result;
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
          description: input.description,
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
      const document = await ctx.db.document.create({
        data: {
          type: input.type,
          title: input.title,
          description: input.description,
          mime: input.mime,
          size: input.size,
          url: input.url,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
          studentId: input.entityType == "student" ? input.entityId : null,
          staffId: input.entityType == "staff" ? input.entityId : null,
          contactId: input.entityType == "contact" ? input.entityId : null,
          classroomId: input.entityType == "classroom" ? input.entityId : null,
        },
      });
      const filename = document.title ?? document.url;
      ctx.activityLog.log({
        action: ActivityAction.UPLOADED,
        targetType: input.entityType as ActivityTargetType,
        targetId: input.entityId,
        description: `${ctx.activityLog.actor} a téléversé le document <strong>${filename}</strong>`,
        metadata: { documentTitle: filename, actorName: ctx.activityLog.actor },
      });
      return document;
    }),
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.document.findUniqueOrThrow({
      include: {
        student: true,
        staff: true,
        contact: true,
        classroom: true,
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
          classroom: true,
          createdBy: true,
        },
      });
    }),
  stats: protectedProcedure
    .input(
      z.object({
        entityType: z.enum(["student", "staff", "contact", "classroom"]),
        entityId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const docs = await ctx.db.document.findMany({
        where: {
          ...(input.entityType == "student"
            ? { studentId: input.entityId }
            : {}),
          ...(input.entityType == "staff" ? { staffId: input.entityId } : {}),
          ...(input.entityType == "contact"
            ? { contactId: input.entityId }
            : {}),
          ...(input.entityType == "classroom"
            ? { classroomId: input.entityId }
            : {}),
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
          action: { in: [ActivityAction.UPLOADED, ActivityAction.DOWNLOADED, ActivityAction.DELETE] },
          targetType: input.entityType,
          targetId: input.entityId,
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
      const dlFilename = document.title ?? document.url;
      ctx.activityLog.log({
        action: ActivityAction.DOWNLOADED,
        targetType: entity.targetType as ActivityTargetType,
        targetId: entity.targetId,
        description: `${ctx.activityLog.actor} a téléchargé le document <strong>${dlFilename}</strong>`,
        metadata: { documentTitle: dlFilename, actorName: ctx.activityLog.actor },
      });

      return document.id;
    }),
} satisfies TRPCRouterRecord;
