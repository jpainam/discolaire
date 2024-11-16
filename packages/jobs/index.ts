import parser from "cron-parser";

import { db } from "@repo/db";

import { jobQueue } from "./queue";
import { transactionSummary } from "./trigger/transaction-summary";

export const name = "jobs";
export * from "@trigger.dev/sdk/v3";
export { parser, transactionSummary };

export async function initializeJobs() {
  const tasks = await db.scheduleTask.findMany();
  console.log(`Initializing jobs ${tasks.length}...`);
  for (const task of tasks) {
    await jobQueue.upsertJobScheduler(
      task.name,
      { pattern: task.cron },
      {
        name: task.name,
        data: task.data,
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
