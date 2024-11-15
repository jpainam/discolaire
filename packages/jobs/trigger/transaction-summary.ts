import { render } from "@react-email/render";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import parser from "cron-parser";

import { db } from "@repo/db";
import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";

import { env } from "../env";

const headersList = {
  Authorization: `Bearer ${env.MESSAGING_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const transactionSummary = schedules.task({
  id: "transaction-summary",
  run: async (payload) => {
    const { externalId: staffId } = payload;
    if (!staffId) {
      throw new Error("Staff id is required");
    }
    const staff = await db.staff.findUnique({ where: { id: staffId } });
    if (!staff) {
      throw new Error("Staff not found");
    }
    const school = await db.school.findUniqueOrThrow({
      where: { id: staff.schoolId },
    });

    const scheduledTask = await db.transactionSummarySchedule.findFirstOrThrow({
      where: {
        staffId,
      },
    });
    const interval = parser.parseExpression(scheduledTask.cron);
    const startDate = interval.prev().toDate();
    const endDate = new Date();
    const transactions = await db.transaction.findMany({
      include: {
        account: true,
      },
      where: {
        account: {
          student: {
            schoolId: school.id,
          },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (staff.email != null) {
      throw new Error("Staff email is required");
    }

    const emailHtml = render(
      TransactionsSummary({
        locale: "fr",
        school: {
          name: school.name,
          id: school.id,
          logo: school.logo ?? "",
        },
        transactions: transactions.map((transaction) => {
          return {
            id: transaction.id,
            description: transaction.description ?? "",
            name: transaction.account.name ?? "",
            date: transaction.createdAt.toISOString(),
            amount: transaction.amount,
            status: transaction.status,
            currency: school.currency,
          };
        }),
        fullName: staff.lastName + " " + staff.firstName,
      }),
    );
    const bodyContent = JSON.stringify({
      html: emailHtml,
      subject: "Transactions Summary",
      from: "DisScolaire <no-reply@discolaire.com>",
      to: staff.email,
    });
    logger.info(`Sending email to ${staff.email}`);
    const response = await fetch(`${baseUrl}/api/v1/emails`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    if (!response.ok) {
      console.error(response.statusText);
      throw new Error(response.statusText);
    }
    const data = await response.text();
    logger.info(data);
  },
});
