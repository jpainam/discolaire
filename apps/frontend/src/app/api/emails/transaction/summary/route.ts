/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render } from "@react-email/render";
import { z } from "zod/v4";

import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";
import { sendEmail } from "@repo/utils/resend";

import { getSession } from "~/auth/server";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { getQueryClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

const schema = z.object({
  userId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  schoolYearId: z.string(),
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
      const error = z.treeifyError(result.error).errors;
      return new Response(JSON.stringify(error), { status: 400 });
    }
    const { userId, startDate, endDate } = result.data;
    const baseUrl = await getRequestBaseUrl();
    const queryClient = getQueryClient();
    const transactions = await queryClient.fetchQuery(
      trpc.transaction.all.queryOptions({
        from: startDate,
        to: endDate,
      }),
    );

    const user = await queryClient.fetchQuery(
      trpc.user.get.queryOptions(userId),
    );

    if (!user.email) {
      return new Response("User does not have an email address", {
        status: 400,
      });
    }
    const school = await queryClient.fetchQuery(
      trpc.school.get.queryOptions(user.schoolId),
    );

    const plainText = await render(
      TransactionsSummary({
        baseUrl,
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
        baseUrl,
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
