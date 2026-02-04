import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { NotificationChannel } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const notificationSubscriptionRouter = {
  create: protectedProcedure
    .input(
      z.object({
        entityId: z.string().min(1),
        profile: z.enum(["student", "staff", "contact"]),
        balance: z.number().default(0),
        channel: z.enum(NotificationChannel),
        plan: z.string(),
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
      return ctx.db.notificationSubscription.create({
        data: {
          recipientId: recipient.id,
          plan: input.plan,
          balance: input.balance,
          channel: input.channel,
          createdById: ctx.session.user.id,
          schoolId: ctx.schoolId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.union([z.string(), z.array(z.string())]))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notificationSubscription.deleteMany({
        where: {
          id: {
            in: Array.isArray(input) ? input : [input],
          },
          schoolId: ctx.schoolId,
        },
      });
    }),
  count: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await ctx.db.notificationSubscription.findMany({
      where: {
        schoolId: ctx.schoolId,
      },
    });
    return subscriptions.reduce(
      (acc, subsc) => {
        const b = subsc.balance;
        acc.sms += subsc.channel == NotificationChannel.SMS && b != -1 ? b : 0;
        acc.email +=
          subsc.channel == NotificationChannel.EMAIL && b != -1 ? b : 0;
        acc.whatsapp +=
          subsc.channel == NotificationChannel.WHATSAPP && b != -1 ? b : 0;
        acc.unlimitedSms +=
          subsc.channel == NotificationChannel.SMS && b == -1 ? 1 : 0;
        acc.unlimitedEmail +=
          subsc.channel == NotificationChannel.EMAIL && b == -1 ? 1 : 0;
        acc.unlimitedWhatsapp +=
          subsc.channel == NotificationChannel.WHATSAPP && b == -1 ? 1 : 0;

        return acc;
      },
      {
        sms: 0,
        email: 0,
        whatsapp: 0,
        unlimitedSms: 0,
        unlimitedEmail: 0,
        unlimitedWhatsapp: 0,
      },
    );
  }),
  sum: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(1000) }))
    .query(async ({ ctx, input }) => {
      const counts = await ctx.db.notificationSubscription.findMany({
        where: {
          schoolId: ctx.schoolId,
        },
      });
      const recipientIds = counts.map((c) => c.recipientId);
      const recipients = await ctx.db.notificationRecipient.findMany({
        take: input.limit,
        where: {
          id: { in: recipientIds },
        },
        select: { id: true, profile: true, entityId: true },
      });
      return recipients.map((recipient) => ({
        recipientId: recipient.id,
        profile: recipient.profile,
        entityId: recipient.entityId,
        sms: 0,
        email: 0,
        whatsapp: 0,
      }));
    }),
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(100),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.notificationSubscription.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        where: {
          schoolId: ctx.schoolId,
        },
      });
    }),
} satisfies TRPCRouterRecord;
