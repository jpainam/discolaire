/* eslint-disable @typescript-eslint/require-await */
// packages/worker/src/queues/index.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import * as z from "zod";

import { db } from "@repo/db";

import { env } from "./env";
import { transactionWorker } from "./transaction";

// const connection = new IORedis(
//   process.env.REDIS_URL ?? "redis://localhost:6379",
// );
const connection = new IORedis(`${env.REDIS_URL}?family=0`, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Define workers
new Worker(
  "email",

  async (job) => {
    // Email logic here (e.g., AWS SES, nodemailer)
    console.log("Sending email...", job.data);
  },
  { connection },
);

new Worker(
  "sms",
  async (job) => {
    // SMS logic here (e.g., Twilio)
    console.log("Sending SMS...", job.data);
  },
  { connection },
);

const notificationSchema = z.object({
  type: z.string().min(1),
  id: z.union([z.string(), z.coerce.number()]),
});
new Worker(
  "notification",
  async (job) => {
    const result = notificationSchema.safeParse(job.data);
    if (!result.success) {
      const errors = result.error.format();
      console.error(errors);
      return;
    }
    const { type, id } = result.data;
    switch (type) {
      case "transaction":
        await transactionWorker.create(Number(id));
        break;
    }
  },
  { connection },
);

const logSchema = z.object({
  userId: z.string().min(1),
  event: z.string().min(1),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  source: z.string().min(1),
  schoolId: z.string().min(1),
  schoolYearId: z.string().min(1),
  eventType: z.enum(["CREATE", "UPDATE", "DELETE", "READ"]).default("READ"),
  data: z.any().optional(),
});

new Worker(
  "log",
  async (job) => {
    const result = logSchema.safeParse(job.data);

    if (!result.success) {
      console.error(result.error);
      const errors = result.error.format();
      console.error(errors);
      return;
    }
    const { event } = result.data;
    console.log("Logging", event);

    await db.logActivity.create({
      data: {
        ...result.data,
        data: JSON.stringify(result.data.data),
      },
    });
  },
  { connection },
);
