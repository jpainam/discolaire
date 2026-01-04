import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  NotificationChannel,
  NotificationSourceType,
  NotificationTemplateStatus,
} from "@repo/db";

import {
  TemplateValidationError,
  validateTemplateReferences,
} from "../exceptions/TemplateValidationError";
import { protectedProcedure } from "../trpc";

export const notificationTemplateRouter = {
  create: protectedProcedure
    .input(
      z.object({
        sourceType: z.enum(NotificationSourceType),
        channel: z.enum(NotificationChannel),
        locale: z.string().optional(),
        name: z.string().min(2),
        status: z.enum(NotificationTemplateStatus).default("DRAFT"),
        subject: z.string().optional(),
        body: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allowed = await ctx.db.notificationTemplateVariable.findMany({
        where: {
          sourceType: input.sourceType,
          schoolId: ctx.schoolId,
        },
        select: { key: true },
      });
      try {
        validateTemplateReferences({
          allowed,
          subjectTemplate: input.subject ?? null,
          bodyTemplate: input.body,
        });
      } catch (e) {
        if (e instanceof TemplateValidationError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: e.message,
            cause: e.details,
          });
        }
        throw e;
      }

      const created = await ctx.db.notificationTemplate.create({
        data: {
          schoolId: ctx.schoolId,
          sourceType: input.sourceType,
          channel: input.channel,
          locale: input.locale ?? null,
          name: input.name,
          status: input.status,
          subjectTemplate: input.subject ?? null,
          bodyTemplate: input.body,
          version: 1,
        },
      });

      return created;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        subject: z.string().optional(),
        body: z.string().min(1),
        locale: z.string().min(1),
        status: z.enum(NotificationTemplateStatus).default("DRAFT"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.notificationTemplate.findFirst({
        where: { id: input.id, schoolId: ctx.schoolId },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found.",
        });
      }

      const nextSubject = input.subject;
      const nextBody = input.body;

      const allowed = await ctx.db.notificationTemplateVariable.findMany({
        where: {
          sourceType: existing.sourceType,
          schoolId: ctx.schoolId,
        },
        select: { key: true },
      });

      try {
        validateTemplateReferences({
          allowed,
          subjectTemplate: nextSubject ?? null,
          bodyTemplate: nextBody,
        });
      } catch (e) {
        if (e instanceof TemplateValidationError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: e.message,
            cause: e.details,
          });
        }
        throw e;
      }

      const shouldBumpVersion =
        input.subject != existing.subjectTemplate ||
        input.body != existing.bodyTemplate;

      const updated = await ctx.db.notificationTemplate.update({
        where: { id: existing.id },
        data: {
          name: input.name,
          status: input.status,
          locale: input.locale,
          subjectTemplate: input.subject,
          bodyTemplate: input.body,
          version: shouldBumpVersion ? { increment: 1 } : undefined,
        },
      });

      return updated;
    }),

  delete: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.notificationTemplate.findFirst({
        where: { id: input, schoolId: ctx.schoolId },
      });
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found.",
        });
      }

      return ctx.db.notificationTemplate.delete({
        where: { id: existing.id },
      });
    }),
} satisfies TRPCRouterRecord;
