import { Queue, QueueEvents } from "bullmq";

import { logger } from "@repo/utils";
import { getRedis } from "./redis-client";

const connection = getRedis();
export const jobQueueName = "job-queue";
export const jobQueue = new Queue(jobQueueName, { connection });

// Queue Events for Debugging
const queueEvents = new QueueEvents(jobQueueName, { connection });

queueEvents.on("failed", (job, _listener) => {
  console.error(`Job ${job.jobId} ${job.failedReason}`);
});

queueEvents.on("completed", (job) => {
  logger.log(`Job ${job.jobId} completed successfully`);
});

jobQueue.on("error", (error) => {
  logger.error(`Queue error: ${error}`);
});

jobQueue.on("waiting", (job) => {
  console.log(`Job ${job} added`);
});
