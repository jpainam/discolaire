import { render } from "@react-email/render";
import { subMonths } from "date-fns";
import { z } from "zod";

import { parser } from "@repo/jobs";
import { TransactionsSummary } from "@repo/transactional";

import { api } from "~/trpc/server";

const schema = z.object({
  staffId: z.string().min(1),
  cron: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = result.error.issues.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { staffId, cron } = result.data;

    const staff = await api.staff.get(staffId);
    if (!staff.email) {
      throw new Error("Staff email is required");
    }

    const school = await api.school.get(staff.schoolId);
    const interval = parser.parseExpression(cron);

    const startDate = interval.prev().toDate();
    console.info(`Fetching transactions from ${startDate.toISOString()}`);
    const endDate = new Date();
    const transactions = await api.transaction.all({
      from: subMonths(startDate, 3),
      to: endDate,
    });
    console.info(`Found ${transactions.length} transactions`);

    const emailHtml = await render(
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

    console.info(`Sending email to ${staff.email}`);

    const response = await api.messaging.sendEmail({
      body: emailHtml,
      to: staff.email,
      subject: "Transactions Summary",
    });
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
