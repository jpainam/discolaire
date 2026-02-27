import { render } from "@react-email/render";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { ExamWeekParentEmail } from "@repo/transactional";

import { env } from "~/env";
import { logger } from "~/utils/logger";
import { FROM, nextWeekWindow, SCHOOL_TENANTS } from "./constants";

/**
 * Every Friday – if exams are next week, send a reminder email to every
 * parent (contact with an email) linked to an active student.
 */
export async function sendExamWeekEmailToParents() {
  const now = new Date();
  const { monday, sunday } = nextWeekWindow(now);

  logger.info("[Cron] Checking for exam week (parent emails)…");

  for (const tenant of SCHOOL_TENANTS) {
    try {
      const db = getDb({ connectionString: env.DATABASE_URL, tenant });

      const configs = await db.termReportConfig.findMany({
        where: {
          examStartDate: { not: null, lte: sunday },
          OR: [{ examEndDate: null }, { examEndDate: { gte: monday } }],
        },
        include: { term: true },
      });

      if (configs.length === 0) {
        logger.info(
          `[Cron] No exam week next week for tenant ${tenant} — skipping parent emails`,
        );
        continue;
      }

      const school = await db.school.findFirst({
        select: { name: true, logo: true, code: true },
      });

      // Resolve the default school year (mirrors school-year-service.getDefault)
      const defaultSchoolYear =
        (await db.schoolYear.findFirst({
          where: { isDefault: true },
          orderBy: { startDate: "desc" },
          select: { id: true },
        })) ??
        (await db.schoolYear.findFirst({
          orderBy: { startDate: "desc" },
          select: { id: true },
        }));

      if (!defaultSchoolYear) {
        logger.warn(
          `[Cron] No school year found for tenant ${tenant} — skipping`,
        );
        continue;
      }

      // Collect students enrolled in the default school year with their contacts
      const students = await db.student.findMany({
        where: {
          enrollments: {
            some: { schoolYearId: defaultSchoolYear.id },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          studentContacts: {
            select: {
              contact: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      let sent = 0;

      for (const config of configs) {
        if (!config.examStartDate) continue;

        const termName = config.term.name;

        for (const student of students) {
          const studentName = [student.firstName, student.lastName]
            .filter(Boolean)
            .join(" ");

          const parentEmails = student.studentContacts
            .map((sc) => ({
              email: sc.contact.email,
              name: [sc.contact.firstName, sc.contact.lastName]
                .filter(Boolean)
                .join(" "),
            }))
            .filter((c): c is { email: string; name: string } =>
              Boolean(c.email),
            );

          for (const parent of parentEmails) {
            const html = await render(
              ExamWeekParentEmail({
                parentName: parent.name || "Parent/Tuteur",
                studentName,
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
                to: parent.email,
                from: FROM,
                subject: `Rappel : semaine d'examens de ${studentName} — ${termName}`,
                html,
              },
            ]);

            sent++;
          }
        }
      }

      logger.info(
        `[Cron] Exam week parent emails enqueued: ${sent} for tenant ${tenant}`,
      );
    } catch (err) {
      const e = err as Error;
      logger.error(
        `[Cron] Failed parent exam emails for tenant ${tenant}: ${e.message}`,
      );
    }
  }

  logger.info("[Cron] Exam week parent email job complete");
}
