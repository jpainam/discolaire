import { render } from "@react-email/render";
import { format, startOfDay, startOfWeek, subDays } from "date-fns";
import { fr } from "date-fns/locale";

import { getDb } from "@repo/db";
import { enqueueEmailJobs } from "@repo/messaging/client";
import { TransactionsSummary } from "@repo/transactional";

import { env } from "~/env";
import { logger } from "~/utils/logger";
import { FROM, getTenantAdminEmails, SCHOOL_TENANTS } from "./constants";

/**
 * Wednesday – send a summary of the last 3 days (Mon → Wed).
 * Friday – send a summary of the full week (Mon → Fri).
 */
export async function sendTransactionSummaryToAdmin(
  periodType: "wednesday" | "friday",
) {
  const now = new Date();

  // Wednesday: go back 2 days to reach Monday; Friday: use start of the current week
  const startDate =
    periodType === "friday"
      ? startOfWeek(now, { weekStartsOn: 1 })
      : startOfDay(subDays(now, 2));

  const periodLabel =
    `du ${format(startDate, "EEEE d MMMM", { locale: fr })} ` +
    `au ${format(now, "EEEE d MMMM yyyy", { locale: fr })}`;

  const subjectPrefix =
    periodType === "friday"
      ? "Bilan hebdomadaire des transactions"
      : "Bilan des 3 derniers jours";

  logger.info(
    `[Cron] Transaction summary (${periodType}) — ${periodLabel}`,
  );

  for (const tenant of SCHOOL_TENANTS) {
    try {
      const db = getDb({ connectionString: env.DATABASE_URL, tenant });

      // Resolve current school year (default first, then latest)
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

      const school = await db.school.findFirst({
        select: { name: true, logo: true, code: true },
      });

      const rawTransactions = await db.transaction.findMany({
        where: {
          schoolYearId: defaultSchoolYear.id,
          deletedAt: null,
          createdAt: { gte: startDate, lte: now },
        },
        orderBy: { createdAt: "asc" },
        select: {
          createdAt: true,
          amount: true,
          description: true,
          method: true,
          status: true,
          transactionType: true,
          student: {
            select: { firstName: true, lastName: true },
          },
        },
      });

      const transactions = rawTransactions.map((tx) => ({
        date: format(tx.createdAt, "dd/MM", { locale: fr }),
        studentName: [tx.student.firstName, tx.student.lastName]
          .filter(Boolean)
          .join(" "),
        description: tx.description,
        amount: tx.amount,
        method: tx.method,
        status: tx.status as "PENDING" | "VALIDATED" | "CANCELED",
        transactionType: tx.transactionType as "CREDIT" | "DEBIT" | "DISCOUNT",
      }));

      const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);
      const totalValidated = transactions
        .filter((t) => t.status === "VALIDATED")
        .reduce((s, t) => s + t.amount, 0);
      const totalPending = transactions
        .filter((t) => t.status === "PENDING")
        .reduce((s, t) => s + t.amount, 0);
      const totalCanceled = transactions
        .filter((t) => t.status === "CANCELED")
        .reduce((s, t) => s + t.amount, 0);

      const schoolCode = school?.code ?? tenant;
      const transactionsUrl = `https://${schoolCode}.discolaire.com/accounting/transactions`;

      const html = await render(
        TransactionsSummary({
          school: { name: school?.name ?? tenant, logo: school?.logo },
          periodLabel,
          periodType,
          transactions,
          totalAmount,
          totalValidated,
          totalPending,
          totalCanceled,
          transactionsUrl,
        }),
      );

      await enqueueEmailJobs(
        getTenantAdminEmails(tenant).map((to) => ({
          to,
          from: FROM,
          subject: `${subjectPrefix} — ${school?.name ?? tenant} (${periodLabel})`,
          html,
        })),
      );

      logger.info(
        `[Cron] Transaction summary sent for tenant ${tenant}: ${transactions.length} transaction(s)`,
      );
    } catch (err) {
      const e = err as Error;
      logger.error(
        `[Cron] Failed transaction summary for tenant ${tenant}: ${e.message}`,
      );
    }
  }

  logger.info(`[Cron] Transaction summary job complete (${periodType})`);
}
