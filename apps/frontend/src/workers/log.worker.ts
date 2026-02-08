/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Worker } from "bullmq";
import { z } from "zod/v4";

import { logQueue, logQueueName } from "./queue";
import { getRedis } from "./redis-client";
import { logActivitySchema } from "./validation-schema";

const connection = getRedis();

new Worker(
  logQueueName,
  async (job) => {
    if (job.name == "log-action") {
      try {
        const result = logActivitySchema.safeParse(job.data);
        if (!result.success) {
          const error = z.treeifyError(result.error);
          throw new Error(`${job.id} ${JSON.stringify(error)}`);
        }
        const {
          userId,
          activityType,
          action,
          entity,
          schoolId,
          entityId,
          data,
        } = result.data;
        const response = await fetch(`/api/logs`, {
          body: JSON.stringify({
            userId,
            activityType,
            action,
            entity,
            entityId,
            schoolId,
            data,
          }),
        });
        if (response.ok) {
          console.log("Log action succeeed");
        } else {
          const error = await response.json();
          console.error(error);
        }
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
  activityType: string;
  action: string;
  entity: string;
  entityId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}) => {
  await logQueue.add("log-action", data);
};
