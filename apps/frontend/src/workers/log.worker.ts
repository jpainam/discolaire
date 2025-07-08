/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Worker } from "bullmq";

import { db } from "@repo/db";
import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";
import { logQueue } from "./queue";
import { getRedis } from "./redis-client";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

const logSchema = z.object({
  userId: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional(),
  metadata: z.any().optional(),
});

const connection = getRedis();

new Worker(
  "log-queue",
  async (job) => {
    if (job.name == "log-action") {
      try {
        const result = logSchema.safeParse(job.data);
        if (!result.success) {
          const validationError = fromError(result.error);
          throw new Error(`${job.id} ${validationError.message}`);
        }
        const { userId, action, entity, entityId, metadata } = result.data;
        await db.logActivity.create({
          data: { userId, action, entity, entityId, metadata },
        });
      } catch (error) {
        console.log("Error processing log job:", error);
        throw error;
      }
    }
  },
  { connection }
);

export const logAction = async (data: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}) => {
  await logQueue.add("log-action", data);
};
