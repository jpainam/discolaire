/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Job } from "bullmq";
import * as z from "zod";

import { db } from "@repo/db";

import { generateToken } from "./utils";

const dataSchema = z.object({
  name: z.string().min(1),
  data: z.any(),
  schoolYearId: z.string().min(1),
  schoolId: z.string().min(1),
  cron: z.string().min(1),
  url: z.string().min(1),
  id: z.number(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function jobWorker(job: Job<any, any, string>) {
  const result = dataSchema.safeParse(job.data);
  if (!result.success) {
    const error = result.error.errors.map((e) => e.message).join(", ");
    throw new Error(`Invalid job data for job ${job.id} ${error}`);
  }

  const { id, url, data, cron, schoolYearId } = result.data;

  try {
    // Mark the task as running
    await db.scheduleTask.update({
      where: { id: id },
      data: { status: "running", lastRun: new Date() },
    });

    const user = await db.user.findFirstOrThrow({
      where: {
        username: "admin",
      },
    });

    const headers = new Map<string, string>();
    headers.set("x-trpc-source", "job-worker");
    headers.set("x-school-year", schoolYearId);

    const token = await generateToken({ id: user.id });

    headers.set("Cookie", `session=${token}`);

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ ...data, cron: cron }),
      headers: Object.fromEntries(headers),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
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
