import { Queue, Worker } from "bullmq";
import * as z from "zod";

import { db } from "@repo/db";

import { getRedis } from "./redis-client";

const connection = getRedis();
const queueName = "job-queue";
const jobQueue = new Queue(queueName, { connection });

const dataSchema = z.object({
  name: z.string().min(1),
  data: z.any(),
  id: z.number(),
});
new Worker(
  queueName,
  async (job) => {
    const result = dataSchema.safeParse(job.data);
    if (!result.success) {
      console.error(`Invalid job data for job ${job.id}:`, result.error);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id, name, data } = result.data;
    console.log("All the job data", job);
    console.log(`Processing job: ${name} with data:`, data);

    try {
      // Mark the task as running
      await db.scheduleTask.update({
        where: { id: id },
        data: { status: "running", lastRun: new Date() },
      });

      // Perform the task logic here
      void fetch(`/api/jobs/${name}`, {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .catch((error) =>
          console.error(`Error processing job ${name}:`, error),
        );

      // Mark the task as completed
      await db.scheduleTask.update({
        where: { id: id },
        data: { status: "completed" },
      });
    } catch (error) {
      console.error(`Error processing job ${name}:`, error);
      await db.scheduleTask.update({
        where: { id: id },
        data: { status: "failed" },
      });
    }
  },
  { connection },
);

export { jobQueue };
