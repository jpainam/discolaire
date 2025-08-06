import { Queue, QueueEvents } from "bullmq";

import { logger } from "@repo/utils";

import { getRedis } from "./redis-client";

export const JobNames = {
  TRANSACTION_SUMMARY: "transaction-summary",
  NEW_GRADE_NOTIFICATION: "new-grade-notification",
};

const connection = getRedis();
export const jobQueueName = "job-queue";
export const logQueueName = "log-queue";
export const backupQueueName = "backup-queue";
export const jobQueue = new Queue(jobQueueName, { connection });
export const logQueue = new Queue(logQueueName, { connection });
export const backupQueue = new Queue(backupQueueName, { connection });

// Queue Events for Debugging
const queueEvents = new QueueEvents(jobQueueName, { connection });

queueEvents.on("failed", (job, _listener) => {
  console.error(`Job ${job.jobId} ${job.failedReason}`);
});

queueEvents.on("completed", (job) => {
  logger.info(`Job ${job.jobId} completed successfully`);
});

jobQueue.on("error", (error) => {
  logger.error(`Queue error: ${error}`);
});

jobQueue.on("waiting", (job) => {
  console.log(`Job ${job} added`);
});

logQueue.on("error", (error) => {
  logger.error(`Log queue error: ${error}`);
});
logQueue.on("waiting", (job) => {
  console.log(`Log job ${job} added`);
});
