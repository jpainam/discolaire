/**
 * sesEmail tRPC router
 *
 * Single integration point for pushing email jobs into the AWS SQS queue
 * from anywhere in the tRPC API (server actions, background jobs, etc.).
 *
 * The actual SQS client + Zod validation live in @repo/messaging/client.
 * This router is a thin, authenticated wrapper.
 *
 * Procedures:
 *   sesEmail.enqueue  — individual jobs, each with its own recipient + content
 *   sesEmail.broadcast — one template → N recipients, each send is individual
 */
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { broadcastEmail, enqueueEmailJobs } from "@repo/messaging/client";
import { BroadcastEmailSchema, EmailJobSchema } from "@repo/messaging/schemas";
import { protectedProcedure } from "../trpc";

export const sesEmailRouter = {
  /**
   * Enqueue one or more individual email jobs.
   *
   * Each job must carry its own `to`, `subject`, and `html`. Use this when
   * email content differs per recipient (e.g. personalised invoices).
   *
   * Requires: SQS_EMAIL_QUEUE_URL on the Next.js server.
   */
  enqueue: protectedProcedure
    .input(
      z.object({
        jobs: z.array(EmailJobSchema).min(1).max(500),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await enqueueEmailJobs(input.jobs);

      if (result.failed.length > 0) {
        console.warn(
          `[sesEmail.enqueue] ${result.failed.length} job(s) failed to enqueue:`,
          result.failed.map((f) => ({
            to: f.job.to,
            code: f.code,
            message: f.message,
          })),
        );
      }

      return {
        messageIds: result.messageIds,
        enqueuedCount: result.messageIds.length,
        failedCount: result.failed.length,
      };
    }),

  /**
   * Send the same email to many recipients, each as an individual SES send.
   *
   * Recipients see it as if the email was addressed only to them (no CC/BCC).
   * A stable `broadcastId` ensures duplicate-safe re-drives — DynamoDB
   * idempotency keys (`${broadcastId}::${email}`) prevent double-sends.
   *
   * Supports up to 10 000 recipients per call. The client fans them out into
   * individual SQS messages (batched 10 at a time, 5 concurrent) and the
   * Lambda consumer sends each one separately via SES.
   *
   * @example
   * ```ts
   * await trpc.sesEmail.broadcast.mutate({
   *   broadcastId: "fee-reminder-2025-q2",
   *   recipients: ["alice@school.com", "bob@school.com"],
   *   subject: "Fee reminder – Q2 2025",
   *   html: "<p>Your payment is due by Jan 31.</p>",
   *   text: "Your payment is due by Jan 31.",
   *   tags: { type: "fee-reminder", term: "q2-2025" },
   * });
   * ```
   */
  broadcast: protectedProcedure
    .input(BroadcastEmailSchema)
    .mutation(async ({ input }) => {
      const result = await broadcastEmail(input);

      if (result.failedCount > 0) {
        console.warn(
          `[sesEmail.broadcast] ${result.failedCount} recipient(s) failed to enqueue:`,
          result.failedRecipients,
        );
      }

      return result;
    }),
} satisfies TRPCRouterRecord;
