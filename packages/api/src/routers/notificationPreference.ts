import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { NotificationChannel, NotificationSourceType } from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

export const notificationPreferenceRouter = {
  user: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        profile: z.enum(["student", "staff", "contact"]),
      }),
    )
    .query(async ({ input, ctx }) => {
      const recipient = await ctx.services.notification.ensureRecipient({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: input.entityId,
          profile: input.profile,
        },
      });
      const prefs = await ctx.db.notificationPreference.findMany({
        where: {
          recipientId: recipient.id,
        },
      });
      // return as {event: string, channels: {email: boolean, sms: boolean, whatsapp: boolean}}
      const notificationPreferences = prefs.map((pref) => {
        return {
          entityId: input.entityId,
          id: pref.id,
          channel: pref.channel,
          sourceType: pref.sourceType,
          enabled: pref.enabled,
        };
      });
      return notificationPreferences;
    }),
  upsert: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        profile: z.enum(["staff", "contact", "student"]),
        sourceType: z.enum(NotificationSourceType),
        channel: z.enum(NotificationChannel),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipient = await ctx.services.notification.ensureRecipient({
        schoolId: ctx.schoolId,
        recipient: {
          entityId: input.entityId,
          profile: input.profile,
        },
      });
      return ctx.db.notificationPreference.upsert({
        create: {
          recipientId: recipient.id,
          sourceType: input.sourceType,
          channel: input.channel,
          enabled: input.enabled,
        },
        update: {
          enabled: input.enabled,
        },
        where: {
          recipientId_sourceType_channel: {
            recipientId: recipient.id,
            sourceType: input.sourceType,
            channel: input.channel,
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
