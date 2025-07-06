/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render } from "@react-email/render";
import { db } from "@repo/db";
import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";
import { sendEmail } from "@repo/utils";
import { z } from "zod";

import { getSession } from "~/auth/server";
import { getFullName } from "~/utils";

const schema = z.object({
  schoolId: z.string(),
  userId: z.string(),
  transactions: z.array(
    z.object({
      id: z.coerce.number(),
      description: z.string().optional(),
      student: z.object({
        lastName: z.string().default(""),
        firstName: z.string().default(""),
      }),
      createdAt: z.coerce.date(),
      amount: z.coerce.number(),
      status: z.string(),
      deletedAt: z.coerce.date().nullable(),
    }),
  ),
});
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = result.error.errors.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { schoolId, userId, transactions } = result.data;
    const school = await db.school.findUniqueOrThrow({
      where: {
        id: schoolId,
      },
    });
    const user = await db.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    if (!user.email) {
      return new Response("User does not have an email address", {
        status: 400,
      });
    }

    const plainText = await render(
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
            name: getFullName(transaction.student),
            date: transaction.createdAt.toISOString(),
            amount: transaction.amount,
            status: transaction.status,
            currency: school.currency,
            deleted: transaction.deletedAt != null,
          };
        }),
        fullName: user.name,
      }),
      {
        plainText: true,
      },
    );

    await sendEmail({
      from: `${school.name} <contact@discolaire.com>`,
      text: plainText,
      react: TransactionsSummary({
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
            name: getFullName(transaction.student),
            date: transaction.createdAt.toISOString(),
            amount: transaction.amount,
            status: transaction.status,
            currency: school.currency,
            deleted: transaction.deletedAt != null,
          };
        }),
        fullName: user.name,
      }),
      subject: `Résumé des transactions - ${school.name}`,
      to: user.email,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
