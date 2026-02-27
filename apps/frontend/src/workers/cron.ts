import cron from "node-cron";

import { env } from "~/env";
import { logger } from "~/utils/logger";
import { runDbBackup } from "./jobs/db-backup";
import { sendExamReminderToAdmin } from "./jobs/exam-reminder-admin";
import { sendExamWeekEmailToParents } from "./jobs/exam-week-parents";
import { sendStaffWeeklyTimetables } from "./jobs/staff-weekly-timetables";

export function runCronJobs() {
  // Every Wednesday at 10:00 — alert admin if exams are scheduled next week
  cron.schedule("0 10 * * 3", () => {
    void sendExamReminderToAdmin();
  });
  logger.info("[Cron] Admin exam reminder job scheduled (Wednesdays 10:00)");

  // Every Friday at 10:00 — email all parents if exams are next week
  cron.schedule("0 10 * * 5", () => {
    void sendExamWeekEmailToParents();
  });
  logger.info("[Cron] Parent exam week email job scheduled (Fridays 10:00)");

  // Every Friday at 16:00 — sends next week's timetable to staff who have an email
  cron.schedule("0 16 * * 5", () => {
    void sendStaffWeeklyTimetables();
  });
  logger.info("[Cron] Weekly staff timetable job scheduled (Fridays 16:00)");

  if (env.NEXT_PUBLIC_DEPLOYMENT_ENV === "local") {
    cron.schedule("0 12,18 * * *", () => {
      void runDbBackup();
    });
    logger.info(
      "[Cron] DB backup job scheduled (local, daily 12:00 and 18:00)",
    );
  }
}
