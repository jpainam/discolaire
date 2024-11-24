import { Queue, QueueEvents } from "bullmq";

import { getRedis } from "./redis-client";

const connection = getRedis();
const queueName = "job-queue";
const jobQueue = new Queue(queueName, { connection });

// Queue Events for Debugging
const queueEvents = new QueueEvents(queueName, { connection });

queueEvents.on("failed", (job, failedReason) => {
  console.error(
    `Job ${job.jobId} failed with reason: ${failedReason} ${job.failedReason}`,
  );
});

queueEvents.on("completed", (job) => {
  console.log(`Job ${job.jobId} completed successfully`);
});

jobQueue.on("error", (error) => {
  console.error(`Queue error: ${error}`);
});

jobQueue.on("waiting", (job) => {
  console.log(`Job ${job} added`);
});
export { jobQueue, queueName };
