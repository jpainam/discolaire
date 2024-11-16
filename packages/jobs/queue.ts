import { Queue, Worker } from "bullmq";

import { db } from "@repo/db";

import { getRedis } from "./redis-client";

const connection = getRedis();
const queueName = "job-queue";
const jobQueue = new Queue(queueName, { connection });

new Worker(
  queueName,
  async (job) => {
    const { name, data } = job.data;
    console.log("All the job data", job);
    console.log(`Processing job: ${name} with data:`, data);

    try {
      // Mark the task as running
      await db.scheduleTask.update({
        where: { id: job.data.id },
        data: { status: "running", lastRun: new Date() },
      });

      // Perform the task logic here
      fetch(`/api/jobs/${name}`, {
        method: "POST",
        body: JSON.stringify(job.data),
      });

      // Mark the task as completed
      await db.scheduleTask.update({
        where: { id: job.data.id },
        data: { status: "completed" },
      });
    } catch (error) {
      console.error(`Error processing job ${name}:`, error);
      await db.scheduleTask.update({
        where: { id: job.data.id },
        data: { status: "failed" },
      });
    }
  },
  { connection },
);

export { jobQueue };
