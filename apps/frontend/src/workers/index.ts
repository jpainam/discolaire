/**
 * This file only initilializes the job queue and sets up the cron jobs.
 * It does not contain any job processing logic.
 * The actual job processing logic is in the worker folders.
 */

export const name = "jobs";

export async function initializeJobs() {
  // No queue-based jobs remain; cron jobs are registered via runCronJobs()
}

// All jobs need to be exported for the worker to pick them up
//export * from "./grade-notification.worker";
export * from "./log.worker";
