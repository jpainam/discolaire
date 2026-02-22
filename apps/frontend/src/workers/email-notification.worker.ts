/* eslint-disable @typescript-eslint/no-unused-vars */
import { Worker } from "bullmq";

import type { EmailJobData } from "@repo/api/notifications/email-queue";
import { sendEmail } from "@repo/api/notifications/email";
import { EMAIL_QUEUE_NAME } from "@repo/api/notifications/email-queue";
import { getDb } from "@repo/db";

import { env } from "~/env";
import { logger } from "~/utils/logger";
import { getRedis } from "./redis-client";

const connection = getRedis();

logger.info("[Worker] Email notification worker initialized");

export const emailNotificationWorker = new Worker<EmailJobData>(
  EMAIL_QUEUE_NAME,
  async (job) => {
    const { deliveryId, tenant, toEmail, sourceType, context } = job.data;

    const db = getDb({ connectionString: env.DATABASE_URL, tenant });

    try {
      ///const { subject, html } = await renderNotificationEmail(sourceType, context);
      const res = await sendEmail({
        toEmail,
        subject: "",
        bodyText: "<p>html</p>",
      });

      await db.notificationDelivery.update({
        where: { id: deliveryId },
        data: {
          status: "SENT",
          provider: res?.provider ?? "resend",
          providerMsgId: res?.providerMsgId,
          sentAt: new Date(),
          error: null,
          attemptCount: { increment: 1 },
        },
      });

      logger.info(
        `[EmailWorker] Sent email to ${toEmail} (delivery ${deliveryId})`,
      );
    } catch (err) {
      const error = err as Error;
      logger.error(
        `[EmailWorker] Failed to send email to ${toEmail}: ${error.message}`,
      );

      await db.notificationDelivery.update({
        where: { id: deliveryId },
        data: {
          status: "FAILED",
          error: error.message,
          attemptCount: { increment: 1 },
        },
      });

      throw err; // rethrow so BullMQ retries
    }
  },
  {
    connection,
    // Rate limit: 1 email per second to stay within Resend free tier
    limiter: {
      max: 1,
      duration: 1000,
    },
    concurrency: 1,
  },
);

emailNotificationWorker.on("failed", (job, err) => {
  logger.error(
    `[EmailWorker] Job ${job?.id} failed permanently: ${err.message}`,
  );
});
