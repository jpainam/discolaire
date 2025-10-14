import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure } from "../trpc";

const getInitials = (name: string | null | undefined) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2) ?? ""
  );
};
export const emailRouter = {
  get: protectedProcedure
    .input(z.string().min(1))
    .query(async ({ ctx, input }) => {
      const email = await ctx.db.email.findUniqueOrThrow({
        where: { id: input },
        include: {
          sender: true,
          recipients: { include: { user: true } },
          replies: {
            include: {
              sender: true,
              recipients: { include: { user: true } },
            },
          },
        },
      });

      return {
        id: email.id,
        from: email.sender.name,
        email: email.sender.email,
        subject: email.subject,
        preview: email.body.slice(0, 60) + "...",
        date: email.createdAt,
        read: true, // you can later track this per user in EmailRecipient
        folder: "inbox", // derive based on currentUserEmail
        group: "work", // optionally derive from metadata or tags
        avatar: getInitials(email.sender.name),
        thread: [
          {
            id: `${email.id}-1`,
            from: email.sender.name,
            email: email.sender.email,
            to: email.recipients.map((r) => r.user.email).join(", "),
            subject: email.subject,
            content: email.body,
            date: email.createdAt,
            avatar: getInitials(email.sender.name),
          },
          ...email.replies.map((reply, index) => ({
            id: `${reply.id}-${index + 2}`,
            from: reply.sender.name,
            email: reply.sender.email,
            to: reply.recipients.map((r) => r.user.email).join(", "),
            subject: reply.subject,
            content: reply.body,
            date: reply.createdAt,
            avatar: getInitials(reply.sender.name),
          })),
        ],
      };
    }),
  all: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        query: z.string().optional(),
        unreadOnly: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId;
      const { unreadOnly = false, limit, offset, query } = input;
      const qq = `%${query?.toLowerCase()}%`;
      const received = await ctx.db.emailRecipient.findMany({
        where: {
          userId,
          deletedAt: null,
          ...(unreadOnly && { readAt: null }),
          email: {
            ...(query && {
              OR: [
                { subject: { contains: qq, mode: "insensitive" } },
                { body: { contains: qq, mode: "insensitive" } },
              ],
            }),
          },
        },
        include: {
          email: {
            include: {
              sender: true,
              recipients: { include: { user: true } },
            },
          },
        },
        skip: offset,
        take: limit,
      });

      // Sent emails
      const sent = await ctx.db.email.findMany({
        where: {
          senderId: userId,
          deletedBySenderAt: null,
          ...(query && {
            OR: [
              { subject: { contains: qq, mode: "insensitive" } },
              { body: { contains: qq, mode: "insensitive" } },
            ],
          }),
        },
        include: {
          sender: true,
          recipients: { include: { user: true } },
        },
        skip: offset,
        take: limit,
      });

      const receivedFormatted = received.map(
        (r) => {
          const e = r.email;
          return {
            id: e.id,
            from: e.sender.name,
            email: e.sender.email,
            subject: e.subject,
            preview: e.body.slice(0, 60) + "...",
            date: e.createdAt,
            read: !!r.readAt,
            folder: "inbox",
            group: "work", // you can derive this from tags later
            avatar: e.sender.avatar,
          };
        },
        //formatEmail(r.email, "inbox", !!r.readAt),
      );
      //formatEmail(e, "sent", true)
      const sentFormatted = sent.map((e) => {
        return {
          id: e.id,
          from: e.sender.name,
          email: e.sender.email,
          subject: e.subject,
          preview: e.body.slice(0, 60) + "...",
          date: e.createdAt,
          read: true,
          folder: "sent",
          group: "work", // you can derive this from tags later
          avatar: e.sender.avatar,
        };
      });

      const allEmails = [...receivedFormatted, ...sentFormatted];

      // Sort by date (newest first)
      return allEmails.sort((a, b) => b.date.getTime() - a.date.getTime());
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const emailId = input;
      await ctx.db.emailRecipient.updateMany({
        where: {
          emailId: emailId,
          userId: userId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      await ctx.db.email.updateMany({
        where: {
          id: emailId,
          senderId: userId,
        },
        data: {
          deletedBySenderAt: new Date(),
        },
      });
    }),
  cleanUp: protectedProcedure.query(async ({ ctx }) => {
    const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Find emails where:
    // - Sender deleted >30d ago
    // - All recipients deleted >30d ago
    const emailsToDelete = await ctx.db.email.findMany({
      where: {
        deletedBySenderAt: { lt: thresholdDate },
        recipients: {
          every: {
            deletedAt: { lt: thresholdDate },
          },
        },
      },
      select: { id: true },
    });

    const emailIds = emailsToDelete.map((e) => e.id);

    if (emailIds.length > 0) {
      // await ctx.email.attachment.deleteMany({
      //   where: { emailId: { in: emailIds } },
      // });
      await ctx.db.emailRecipient.deleteMany({
        where: { emailId: { in: emailIds } },
      });
      await ctx.db.email.deleteMany({ where: { id: { in: emailIds } } });
    }
    console.log(`Deleted ${emailIds.length} emails permanently.`);
  }),
  restore: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Restore if user is sender
      const userId = ctx.session.user.id;
      const emailId = input;
      await ctx.db.email.updateMany({
        where: {
          id: emailId,
          senderId: userId,
        },
        data: { deletedBySenderAt: null },
      });

      // Restore if user is recipient
      await ctx.db.emailRecipient.updateMany({
        where: {
          emailId,
          userId,
        },
        data: { deletedAt: null },
      });
    }),
} satisfies TRPCRouterRecord;
