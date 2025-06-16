/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render } from "@react-email/render";
import { messagingService } from "@repo/api/services";
import { db } from "@repo/db";
import { subMonths } from "date-fns";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "~/auth/server";
//import { parser } from "@repo/jobs";
import { TransactionsSummary } from "@repo/transactional";
import { parser } from "~/jobs";

const schema = z.object({
  staffId: z.string().min(1),
  cron: z.string().min(1),
});

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return new Response("Method not allowed", { status: 405 });
}

export async function POST(req: Request) {
  const session = await getSession();
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

    const staff = await db.staff.findUniqueOrThrow({
      where: {
        id: staffId,
      },
      include: {
        user: true,
      },
    });
    if (!staff.user?.email) {
      throw new Error("Staff email is required");
    }

    const school = await db.school.findUniqueOrThrow({
      where: {
        id: staff.schoolId,
      },
    });
    const interval = parser.parseExpression(cron);

    const schoolYearId = req.headers.get("x-school-year");
    if (!schoolYearId) {
      throw new Error("School year id is required");
    }

    const startDate = interval.prev().toDate();

    const endDate = new Date();
    const transactions = await db.transaction.findMany({
      include: {
        account: true,
      },
      where: {
        AND: [
          { schoolYearId: schoolYearId },
          {
            createdAt: {
              gte: subMonths(startDate, 3),
              lte: endDate,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const emailHtml = await render(
      TransactionsSummary({
        locale: school.defaultLocale,
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
            deleted: transaction.deletedAt != null,
          };
        }),
        fullName: staff.lastName + " " + staff.firstName,
      }),
    );

    const response = await messagingService.sendEmail({
      body: emailHtml,
      receipt: false,
      schedule: "now",
      subject: "Transactions Summary",
      to: staff.user.email,
    });
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
