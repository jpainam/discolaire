import { render } from "@react-email/render";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { ExamReminderAdminEmail } from "@repo/transactional";

import { env } from "~/env";
import { logger } from "~/utils/logger";

import { ADMIN_EMAIL, FROM, SCHOOL_TENANTS, nextWeekWindow } from "./constants";

/**
 * Every Wednesday – alert the admin if exams are scheduled next week.
 * Gives them time to adjust dates before the Friday parent blast.
 */
export async function sendExamReminderToAdmin() {
  const now = new Date();
  const { monday, sunday } = nextWeekWindow(now);

  logger.info("[Cron] Checking for exam week (admin reminder)…");

  for (const tenant of SCHOOL_TENANTS) {
    try {
      const db = getDb({ connectionString: env.DATABASE_URL, tenant });

      // Find any term whose exam period overlaps with next week
      const configs = await db.termReportConfig.findMany({
        where: {
          examStartDate: { not: null, lte: sunday },
          OR: [{ examEndDate: null }, { examEndDate: { gte: monday } }],
        },
        include: {
          term: true,
        },
      });

      if (configs.length === 0) {
        logger.info(
          `[Cron] No exam week next week for tenant ${tenant} — skipping admin reminder`,
        );
        continue;
      }

      const school = await db.school.findFirst({
        select: { name: true, logo: true },
      });

      for (const config of configs) {
        if (!config.examStartDate) continue;

        const termName = config.term.name;
        const examPeriodLabel = config.examEndDate
          ? `du ${format(config.examStartDate, "d MMMM", { locale: fr })} au ${format(config.examEndDate, "d MMMM yyyy", { locale: fr })}`
          : `le ${format(config.examStartDate, "d MMMM yyyy", { locale: fr })}`;

        logger.info(
          `[Cron] Exam week detected for ${termName} (${tenant}): ${examPeriodLabel} — emailing admin`,
        );

        const html = await render(
          ExamReminderAdminEmail({
            termName,
            examStartDate: config.examStartDate,
            examEndDate: config.examEndDate,
            school: {
              name: school?.name ?? tenant,
              logo: school?.logo,
            },
          }),
        );

        await enqueueEmailJobs([
          {
            to: ADMIN_EMAIL,
            from: FROM,
            subject: `Rappel : examens ${termName} — semaine prochaine (${tenant})`,
            html,
          },
        ]);

        logger.info(
          `[Cron] Admin exam reminder sent for ${termName} (${tenant})`,
        );
      }
    } catch (err) {
      const e = err as Error;
      logger.error(
        `[Cron] Failed admin exam reminder for tenant ${tenant}: ${e.message}`,
      );
    }
  }

  logger.info("[Cron] Admin exam reminder job complete");
}
