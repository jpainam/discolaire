import parser from "cron-parser";
import { fromZonedTime } from "date-fns-tz";

import { db } from "@repo/db";

import { env } from "~/env";
import { jobQueue } from "./queue";

export const name = "jobs";

export { parser };

export async function initializeJobs() {
  const repeatableJobs = await jobQueue.getJobSchedulers();
  console.log(`Removing ${repeatableJobs.length} repeatable jobs...`);
  for (const job of repeatableJobs) {
    if (job.id) await jobQueue.removeJobScheduler(job.id);
    console.log(`Removed repeatable job: ${job.key}`);
  }

  console.log("Draining the queue...");
  await jobQueue.drain(true); // Pass `true` to remove delayed jobs as well
  console.log("Queue cleared.");

  const tasks = await db.scheduleTask.findMany();
  console.log(`Initializing jobs ${tasks.length}...`);
  for (const task of tasks) {
    if (!isValidCron(task.cron)) {
      console.error(`Invalid cron pattern for task ${task.name}: ${task.cron}`);
      continue;
    }
    const name = task.name as TaskNameType;
    const url = TASK_NAME_URL_MAP[name];
    const school = await db.school.findUniqueOrThrow({
      where: {
        id: task.schoolId,
      },
    });

    const localTime = fromZonedTime("18:00", school.timezone);
    const cron = task.cron.replace("18", localTime.getUTCHours().toString());

    await jobQueue.upsertJobScheduler(
      `${task.id}-${task.name}`,
      { pattern: cron },
      {
        name: task.name,
        data: {
          ...task,
          url,
        },
        opts: {
          backoff: 3,
          attempts: 5,
          removeOnFail: 10,
        },
      },
    );
  }

  console.log("All jobs initialized and added to the queue.");
}

const TASK_NAME_URL_MAP = {
  "transaction-summary": `${env.NEXT_PUBLIC_BASE_URL}/api/emails/transaction/summary`,
} as const;

type TaskNameType = keyof typeof TASK_NAME_URL_MAP;

function isValidCron(cron: string): boolean {
  try {
    parser.parseExpression(cron);
    return true;
  } catch {
    return false;
  }
}
