/**
 * This file only initilializes the job queue and sets up the cron jobs.
 * It does not contain any job processing logic.
 * The actual job processing logic is in the worker folders.
 */
import parser from "cron-parser";

import { db } from "@repo/db";

import { logger } from "@repo/utils";
import { jobQueue } from "./queue";

export const name = "jobs";

export async function initializeJobs() {
  await jobQueue.obliterate();
  const repeatableJobs = await jobQueue.getJobSchedulers();

  for (const job of repeatableJobs) {
    if (job.id) await jobQueue.removeJobScheduler(job.id);
  }
  logger.log(`[Scheduler] Removed ${repeatableJobs.length} repeatable jobs`);
  await jobQueue.drain(true); // Pass `true` to remove delayed jobs as well
  logger.log("[Scheduler] Queue drained.");

  const tasks = await db.scheduleTask.findMany();
  logger.log(`[Scheduler] Initializing ${tasks.length} jobs`);
  for (const task of tasks) {
    if (!isValidCron(task.cron)) {
      logger.error(`Invalid cron pattern for task ${task.name}: ${task.cron}`);
      continue;
    }
    const school = await db.school.findUniqueOrThrow({
      where: {
        id: task.schoolId,
      },
    });
    logger.log(`[Scheduler] Job ${task.name} with cron ${task.cron}`);
    await jobQueue.upsertJobScheduler(
      `${task.id}-${task.name}`,
      { pattern: task.cron, tz: school.timezone },
      {
        name: task.name,
        data: {
          ...(task.data as Record<string, unknown>),
          name: task.name,
          schoolId: task.schoolId,
          taskId: task.id,
          schoolYearId: task.schoolYearId,
          cron: task.cron,
        },
        opts: {
          removeOnComplete: true,
          // removeOnFail: {
          //   age: 30 * 24 * 3600, // 30 days
          // },
          backoff: 3,
          attempts: 5,
          removeOnFail: 10,
        },
      }
    );
  }

  logger.log("[Scheduler] Jobs initialized successfully");
}

function isValidCron(cron: string): boolean {
  try {
    parser.parseExpression(cron);
    return true;
  } catch {
    return false;
  }
}

export * from "./grade-notification.worker";
export * from "./log.worker";
export * from "./transaction-summary.worker";
