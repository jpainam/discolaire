import type { NextRequest } from "next/server";
import { render } from "@react-email/render";
import { subMonths } from "date-fns";
import { z } from "zod";

import { auth } from "@repo/auth";
import { parser } from "@repo/jobs";
import { TransactionsSummary } from "@repo/transactional";

import { api } from "~/trpc/server";

const schema = z.object({
  staffId: z.string().min(1),
  cron: z.string().min(1),
});

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response("Method not allowed", { status: 405 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    console.log("Processing transaction summary email");
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = result.error.errors.map((e) => e.message).join(", ");
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
