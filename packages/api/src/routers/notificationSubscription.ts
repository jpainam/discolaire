/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { EntityProfile, NotificationChannel } from "@repo/db";

import { protectedProcedure } from "../trpc";

export const notificationSubscriptionRouter = {
  create: protectedProcedure
    .input(
      z.object({
        entityId: z.string().min(1),
        profile: z.enum(EntityProfile),
        balance: z.number().default(0),
        channel: z.enum(NotificationChannel),
        plan: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.notificationSubscription.create({
        data: {
          entityId: input.entityId,
          profile: input.profile,
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
      const studentIds = counts
        .filter((c) => c.profile == EntityProfile.STUDENT)
        .map((c) => c.entityId);
      const staffIds = counts
        .filter((c) => c.profile == EntityProfile.STAFF)
        .map((c) => c.entityId);
      const contactIds = counts
        .filter((c) => c.profile == EntityProfile.CONTACT)
        .map((c) => c.entityId);
      const students = await ctx.db.student.findMany({
        take: input.limit,
        where: {
          id: { in: studentIds },
        },
      });
      const contacts = await ctx.db.contact.findMany({
        take: input.limit,
        where: {
          id: { in: contactIds },
        },
      });
      const staffs = await ctx.db.staff.findMany({
        take: input.limit,
        where: {
          id: { in: staffIds },
        },
      });
      const user = await ctx.db.user.findUniqueOrThrow({
        where: {
          id: "1",
        },
      });
      return counts.map((_count) => {
        //const user = users.find((user) => user.id === count.userId);
        return {
          ...user,
          sms: 0, //count._sum.sms,
          email: 0, //count._sum.email,
          whatsapp: 0, //count._sum.whatsapp,
        };
      });
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
