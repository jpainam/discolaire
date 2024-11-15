import { render } from "@react-email/render";
import { logger, schedules } from "@trigger.dev/sdk/v3";
import { subMonths } from "date-fns";

import { db } from "@repo/db";
import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";

//import { env } from "../env";

const headersList = {
  Authorization: `Bearer ${process.env.MESSAGING_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const messagingBaseUrl = process.env.MESSAGING_SERVICE_URL;

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
    logger.info(`Found staff$`, staff);
    const school = await db.school.findUniqueOrThrow({
      where: { id: staff.schoolId },
    });

    // const scheduledTask = await db.transactionSummarySchedule.findFirstOrThrow({
    //   where: {
    //     staffId,
    //   },
    // });
    //const interval = parser.parseExpression(scheduledTask.cron);
    const startDate = subMonths(new Date(), 3); //interval.prev().toDate();
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
    logger.info(`Found ${transactions.length} transactions`);

    if (!staff.email) {
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

    const response = await fetch(`${messagingBaseUrl}/api/v1/emails`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.text();
    logger.info(data);
  },
});
