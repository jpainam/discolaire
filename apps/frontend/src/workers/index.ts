/**
 * This file only initilializes the job queue and sets up the cron jobs.
 * It does not contain any job processing logic.
 * The actual job processing logic is in the worker folders.
 */

import { logger } from "@repo/utils";

import { backupQueue } from "./queue";
import { scheduleTransactionSummaryNofication } from "./transaction-summary.worker";

export const name = "jobs";

async function scheduleBackup() {
  await backupQueue.add(
    "pg_backup",
    {},
    {
      repeat: {
        pattern: "0 12,18 * * *", // 12 PM and 6 PM daily
        //pattern: "* * * * *", // Every minute for testing
      },
      jobId: "scheduled-db-backup", // prevents duplicates
    },
  );
  logger.info("[Scheduler] DB backup job");
}

export async function initializeJobs() {
  await scheduleTransactionSummaryNofication();
  await scheduleBackup();
}

// All jobs need to be exported for the worker to pick them up
export * from "./db-backup.worker";
export * from "./grade-notification.worker";
export * from "./log.worker";
export * from "./transaction-summary.worker";
