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
      const prefs = await ctx.db.notificationPreference.findMany({
        where: {
          studentId: input.profile == "student" ? input.entityId : null,
          contactId: input.profile == "contact" ? input.entityId : null,
          staffId: input.profile == "staff" ? input.entityId : null,
        },
      });
      // return as {event: string, channels: {email: boolean, sms: boolean, whatsapp: boolean}}
      const notificationPreferences = prefs.map((pref) => {
        return {
          entityId: input.entityId,
          id: pref.id,
          channel: pref.channel,
          sourceType: pref.sourceType,
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
      return ctx.db.notificationPreference.upsert({
        create: {
          studentId: input.profile == "student" ? input.entityId : null,
          contactId: input.profile == "contact" ? input.entityId : null,
          staffId: input.profile == "staff" ? input.entityId : null,
          sourceType: input.sourceType,
          channel: input.channel,
          enabled: input.enabled,
        },
        update: {
          enabled: input.enabled,
        },
        where: {
          staffId_sourceType_channel: {
            staffId: input.entityId,
            sourceType: input.sourceType,
            channel: input.channel,
          },
          contactId_sourceType_channel: {
            contactId: input.entityId,
            sourceType: input.sourceType,
            channel: input.channel,
          },
          studentId_sourceType_channel: {
            studentId: input.entityId,
            sourceType: input.sourceType,
            channel: input.channel,
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
