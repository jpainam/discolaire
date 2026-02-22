import { Queue } from "bullmq";

import redis from "@repo/kv";

export const EMAIL_QUEUE_NAME = "email-notification-queue";

export interface EmailJobData {
  deliveryId: string;
  tenant: string;
  toEmail: string;
  sourceType: string;
  context: Record<string, unknown>;
}

export const emailQueue = new Queue<EmailJobData>(EMAIL_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 100 },
  },
});
