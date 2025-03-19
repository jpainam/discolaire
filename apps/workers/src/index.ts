/* eslint-disable @typescript-eslint/require-await */
// packages/worker/src/queues/index.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import * as z from "zod";

import { db } from "@repo/db";

// const connection = new IORedis(
//   process.env.REDIS_URL ?? "redis://localhost:6379",
// );
const connection = new IORedis(`${process.env.REDIS_URL}?family=0`, {
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

const logSchema = z.object({
  message: z.string().min(1),
  level: z.enum(["info", "warn", "error"]).default("info"),
  action: z.enum(["create", "update", "delete", "read"]).default("read"),
  userId: z.string().min(1),
});
new Worker(
  "log",
  async (job) => {
    const result = logSchema.safeParse(job.data);
    if (!result.success) {
      const errors = result.error.format();
      console.error(errors);
      return;
    }
    const { message, action, level, userId } = result.data;
    await db.logActivity.create({
      data: {
        message,
        level,
        action,
        userId,
      },
    });
  },
  { connection },
);
