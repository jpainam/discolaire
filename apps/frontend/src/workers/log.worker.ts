/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Worker } from "bullmq";
import { fromError } from "zod-validation-error/v4";

import { db } from "@repo/db";
import { logActivitySchema } from "@repo/validators";

import { logQueue } from "./queue";
import { getRedis } from "./redis-client";

const connection = getRedis();

new Worker(
  "log-queue",
  async (job) => {
    if (job.name == "log-action") {
      try {
        const result = logActivitySchema.safeParse(job.data);
        if (!result.success) {
          const validationError = fromError(result.error);
          throw new Error(`${job.id} ${validationError.message}`);
        }
        const { userId, action, entity, schoolId, entityId, metadata } =
          result.data;
        await db.logActivity.create({
          data: { userId, schoolId, action, entity, entityId, metadata },
        });
      } catch (error) {
        console.log("Error processing log job:", error);
        throw error;
      }
    }
  },
  { connection },
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
