import { z } from "zod";

import type { $Enums } from "@repo/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const upsertSchema = z.object({
  userId: z.string(),
  notifications: z.array(
    z.object({
      event: z.enum([
        "grades_updates",
        "absence_alerts",
        "payment_reminders",
        "event_notifications",
        "weekly_summaries",
      ]),
      channels: z.object({
        EMAIL: z.boolean(),
        SMS: z.boolean(),
        WHATSAPP: z.boolean(),
      }),
    }),
  ),
});
export const notificationPreferenceRouter = createTRPCRouter({
  user: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const notifications = await ctx.db.notificationPreference.findMany({
        where: {
          userId: input.userId,
        },
      });
      // return as {event: string, channels: {email: boolean, sms: boolean, whatsapp: boolean}}
      const notificationPreferences = notifications.map((notification) => {
        return {
          userId: notification.userId,
          id: notification.id,
          event: notification.event,
          channels: notification.channels.reduce(
            (acc, channel) => {
              acc[channel] = true;
              return acc;
            },
            {} as Record<$Enums.NotificationChannel, boolean>,
          ),
        };
      });
      return notificationPreferences;
    }),
  upsert: protectedProcedure
    .input(upsertSchema)
    .mutation(async ({ ctx, input }) => {
      for (const notification of input.notifications) {
        const channels = Object.entries(notification.channels)
          .filter(([_, value]) => value)
          .map(([key]) => key) as $Enums.NotificationChannel[];
        await ctx.db.notificationPreference.upsert({
          where: {
            userId_event: {
              userId: input.userId,
              event: notification.event,
            },
          },
          create: {
            userId: input.userId,
            event: notification.event,
            channels: channels,
          },
          update: {
            channels: channels,
          },
        });
      }
      return true;
    }),
});
