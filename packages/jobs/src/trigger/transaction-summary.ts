import { render } from "@react-email/render";
import { schedules } from "@trigger.dev/sdk/v3";
import parser from "cron-parser";

import { db } from "@repo/db";
import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";

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
            id: transaction.id.toString(),
            description: transaction.description,
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
  },
});
