import { render } from "@react-email/render";
import { addDays, format, nextMonday, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { StaffWeeklyTimetableEmail } from "@repo/transactional";

import { env } from "~/env";
import { logger } from "~/utils/logger";
import { FROM, SCHOOL_TENANTS, WEEKDAY_LABELS } from "./constants";

export async function sendStaffWeeklyTimetables() {
  // Compute next week's window (Mon 00:00 → Sun 23:59:59)
  const now = new Date();
  const nextWeekMonday = startOfDay(nextMonday(now));
  const nextWeekSunday = addDays(nextWeekMonday, 6);
  nextWeekSunday.setHours(23, 59, 59, 999);

  const weekLabel = `du ${format(nextWeekMonday, "d", { locale: fr })} au ${format(nextWeekSunday, "d MMMM yyyy", { locale: fr })}`;

  logger.info(`[Cron] Sending weekly timetables for ${weekLabel}`);

  for (const tenant of SCHOOL_TENANTS) {
    try {
      const db = getDb({ connectionString: env.DATABASE_URL, tenant });

      // Fetch all staff with an email address
      const staffList = await db.staff.findMany({
        where: { email: { not: null } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          prefix: true,
          email: true,
          school: { select: { name: true, logo: true } },
        },
      });

      for (const staff of staffList) {
        if (!staff.email) continue;

        // Query timetable slots valid during next week
        const slots = await db.subjectTimetable.findMany({
          where: {
            subject: { teacherId: staff.id },
            validFrom: { lte: nextWeekSunday },
            OR: [{ validTo: null }, { validTo: { gt: nextWeekMonday } }],
          },
          include: {
            subject: {
              include: {
                course: { select: { name: true } },
                classroom: { select: { name: true } },
              },
            },
          },
          orderBy: [{ weekday: "asc" }, { start: "asc" }],
        });

        if (slots.length === 0) continue;

        // Group by weekday
        const byWeekday = new Map<number, typeof slots>();
        for (const slot of slots) {
          const wd = ((slot.weekday % 7) + 7) % 7;
          if (!byWeekday.has(wd)) byWeekday.set(wd, []);
          byWeekday.get(wd)?.push(slot);
        }

        // Build days in weekday order with the actual calendar date for that weekday
        const days = [...byWeekday.entries()]
          .sort(([a], [b]) => a - b)
          .map(([weekday, daySlots]) => {
            // weekday 1 = Monday = +0 days from nextWeekMonday, weekday 0 = Sunday = +6 days
            const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
            const dayDate = addDays(nextWeekMonday, daysFromMonday);
            const dayLabel = `${WEEKDAY_LABELS[weekday] ?? ""} ${format(dayDate, "d MMMM", { locale: fr })}`;
            return {
              dayLabel,
              slots: daySlots.map((s) => ({
                courseName: s.subject.course.name,
                classroomName: s.subject.classroom.name,
                startTime: s.start,
                endTime: s.end,
              })),
            };
          });

        const staffName = `${staff.prefix ? `${staff.prefix} ` : ""}${staff.lastName}`;
        const schoolName = staff.school.name;

        const html = await render(
          StaffWeeklyTimetableEmail({
            staffName,
            weekLabel,
            school: { name: schoolName, logo: staff.school.logo ?? undefined },
            days,
          }),
        );

        await enqueueEmailJobs([
          {
            to: staff.email,
            from: FROM,
            subject: `Votre emploi du temps - semaine ${weekLabel}`,
            html,
          },
        ]);

        logger.info(
          `[Cron] Timetable email enqueued for ${staff.email} (${tenant})`,
        );
      }
    } catch (err) {
      const e = err as Error;
      logger.error(
        `[Cron] Failed to send timetables for tenant ${tenant}: ${e.message}`,
      );
    }
  }

  logger.info("[Cron] Weekly staff timetable job complete");
}
