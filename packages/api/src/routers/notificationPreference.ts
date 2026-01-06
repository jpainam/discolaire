import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  EntityProfile,
  NotificationChannel,
  NotificationSourceType,
} from "@repo/db/enums";

import { protectedProcedure } from "../trpc";

export const notificationPreferenceRouter = {
  user: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        profile: z.enum(EntityProfile),
      }),
    )
    .query(async ({ input, ctx }) => {
      const prefs = await ctx.db.notificationPreference.findMany({
        where: {
          entityId: input.entityId,
          profile: input.profile,
        },
      });
      // return as {event: string, channels: {email: boolean, sms: boolean, whatsapp: boolean}}
      const notificationPreferences = prefs.map((pref) => {
        return {
          entityId: pref.entityId,
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
        profile: z.enum(EntityProfile),
        sourceType: z.enum(NotificationSourceType),
        channel: z.enum(NotificationChannel),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notificationPreference.upsert({
        create: {
          entityId: input.entityId,
          sourceType: input.sourceType,
          channel: input.channel,
          profile: input.profile,
          enabled: input.enabled,
        },
        update: {
          enabled: input.enabled,
        },
        where: {
          entityId_sourceType_channel: {
            entityId: input.entityId,
            sourceType: input.sourceType,
            channel: input.channel,
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;
