import type { Job } from "bullmq";
import * as z from "zod";

import { db } from "@repo/db";

const dataSchema = z.object({
  name: z.string().min(1),
  data: z.unknown(),
  url: z.string().url(),
  id: z.number(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jobWorker(job: Job<any, any, string>) {
  const result = dataSchema.safeParse(job.data);
  if (!result.success) {
    const error = result.error.errors.map((e) => e.message).join(", ");
    throw new Error(`Invalid job data for job ${job.id} ${error}`);
  }

  const { id, name, url, data } = result.data;
  console.log(`Processing job: ${name} with data:`, data);

  try {
    // Mark the task as running
    await db.scheduleTask.update({
      where: { id: id },
      data: { status: "running", lastRun: new Date() },
    });

    // Perform the task logic here
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const json = await response.json();
    console.log(`Job ${name} response:`, json);
    await db.scheduleTask.update({
      where: { id: id },
      data: { status: "completed" },
    });
  } catch (error) {
    await db.scheduleTask.update({
      where: { id: id },
      data: { status: "failed" },
    });
    throw error;
  }
}

export { jobWorker };
