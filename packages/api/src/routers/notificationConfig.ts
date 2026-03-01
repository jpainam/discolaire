import type { TRPCRouterRecord } from "@trpc/server";
import * as z from "zod";

import { NotificationChannel } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

const channelSchema = z.enum(NotificationChannel).default("EMAIL");

const configFields = z.object({
  name: z.string().min(1),
  description: z.string(),
  categoryId: z.string().optional(),
  enabled: z.boolean().default(true),
  allowStaff: z.boolean().default(true),
  allowStudent: z.boolean().default(true),
  allowContact: z.boolean().default(true),
});

export const notificationConfigRouter = {
  // List all configs for this school, optionally filtered by channel or category.
  list: protectedProcedure
    .input(
      z
        .object({
          channel: channelSchema.optional(),
          categoryId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.notificationConfig.findMany({
        where: {
          schoolId: ctx.schoolId,
          ...(input?.channel ? { channel: input.channel } : {}),
          ...(input?.categoryId ? { categoryId: input.categoryId } : {}),
        },
        include: { category: true },
        orderBy: [{ category: { order: "asc" } }, { templateKey: "asc" }],
      });
    }),

  // Fetch a single config by its templateKey + channel.
  get: protectedProcedure
    .input(
      z.object({
        templateKey: z.string(),
        channel: channelSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.notificationConfig.findUnique({
        where: {
          schoolId_templateKey_channel: {
            schoolId: ctx.schoolId,
            templateKey: input.templateKey,
            channel: input.channel,
          },
        },
        include: { category: true },
      });
    }),

  // Create a new template config entry.
  create: protectedProcedure
    .input(
      z
        .object({
          templateKey: z.string().min(1),
          channel: channelSchema,
        })
        .merge(configFields),
    )
    .mutation(async ({ ctx, input }) => {
      const { templateKey, channel, ...fields } = input;
      return ctx.db.notificationConfig.create({
        data: {
          schoolId: ctx.schoolId,
          templateKey,
          channel,
          ...fields,
          updatedById: ctx.session.user.id,
        },
        include: { category: true },
      });
    }),

  // Update name, description, category, or any toggle on an existing config.
  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(configFields.partial()))
    .mutation(async ({ ctx, input }) => {
      const { id, ...fields } = input;
      return ctx.db.notificationConfig.update({
        where: { id },
        data: {
          ...fields,
          updatedById: ctx.session.user.id,
        },
        include: { category: true },
      });
    }),

  // Delete a template config entry.
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notificationConfig.delete({
        where: { id: input.id },
      });
    }),

  // Upsert a single config — used by the admin toggle UI.
  upsert: protectedProcedure
    .input(
      z.object({
        templateKey: z.string(),
        channel: channelSchema,
        categoryId: z.string().optional(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        enabled: z.boolean().optional(),
        allowStaff: z.boolean().optional(),
        allowStudent: z.boolean().optional(),
        allowContact: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        templateKey,
        channel,
        categoryId,
        name,
        description,
        ...toggles
      } = input;
      return ctx.db.notificationConfig.upsert({
        where: {
          schoolId_templateKey_channel: {
            schoolId: ctx.schoolId,
            templateKey,
            channel,
          },
        },
        update: {
          ...(categoryId !== undefined ? { categoryId } : {}),
          ...(name !== undefined ? { name } : {}),
          ...(description !== undefined ? { description } : {}),
          ...toggles,
          updatedById: ctx.session.user.id,
        },
        create: {
          schoolId: ctx.schoolId,
          templateKey,
          channel,
          categoryId,
          name: name ?? templateKey,
          description: description ?? "",
          enabled: toggles.enabled ?? true,
          allowStaff: toggles.allowStaff ?? true,
          allowStudent: toggles.allowStudent ?? true,
          allowContact: toggles.allowContact ?? true,
          updatedById: ctx.session.user.id,
        },
        include: { category: true },
      });
    }),

  // Bulk upsert — used for category-level "Allow all" / "Deny all" actions.
  upsertMany: protectedProcedure
    .input(
      z.object({
        templateKeys: z.string().array().min(1),
        channel: channelSchema,
        enabled: z.boolean().optional(),
        allowStaff: z.boolean().optional(),
        allowStudent: z.boolean().optional(),
        allowContact: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { templateKeys, channel, ...fields } = input;
      return ctx.db.$transaction(
        templateKeys.map((templateKey) =>
          ctx.db.notificationConfig.upsert({
            where: {
              schoolId_templateKey_channel: {
                schoolId: ctx.schoolId,
                templateKey,
                channel,
              },
            },
            update: {
              ...fields,
              updatedById: ctx.session.user.id,
            },
            create: {
              schoolId: ctx.schoolId,
              templateKey,
              channel,
              name: templateKey,
              description: "",
              enabled: fields.enabled ?? true,
              allowStaff: fields.allowStaff ?? true,
              allowStudent: fields.allowStudent ?? true,
              allowContact: fields.allowContact ?? true,
              updatedById: ctx.session.user.id,
            },
          }),
        ),
      );
    }),
} satisfies TRPCRouterRecord;
