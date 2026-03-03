import { render } from "@react-email/render";
import { format, startOfDay, startOfWeek, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod/v4";

import type { TransactionsSummaryProps } from "@repo/transactional/emails/TransactionsSummary";
import TransactionsSummary from "@repo/transactional/emails/TransactionsSummary";

import { getSession } from "~/auth/server";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { buildLogoUrl } from "~/lib/utils";
import { caller, getQueryClient, trpc } from "~/trpc/server";

const schema = z.object({
  userId: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  /**
   * "wednesday" → last 3 days (Mon–Wed); "friday" → current week (Mon–Fri).
   * If omitted, startDate / endDate are used directly.
   */
  periodType: z.enum(["wednesday", "friday"]).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await req.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const error = z.treeifyError(result.error).errors;
      return new Response(JSON.stringify(error), { status: 400 });
    }

    const { userId, periodType } = result.data;
    const now = new Date();

    // Resolve date window
    let startDate: Date;
    let endDate: Date;
    if (periodType === "friday") {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = now;
    } else if (periodType === "wednesday") {
      startDate = startOfDay(subDays(now, 2));
      endDate = now;
    } else {
      startDate = result.data.startDate ?? startOfDay(subDays(now, 6));
      endDate = result.data.endDate ?? now;
    }

    const resolvedPeriodType: TransactionsSummaryProps["periodType"] =
      periodType === "friday" ? "friday" : "wednesday";

    const periodLabel =
      `du ${format(startDate, "EEEE d MMMM", { locale: fr })} ` +
      `au ${format(endDate, "EEEE d MMMM yyyy", { locale: fr })}`;

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

    const mappedTransactions = transactions.map((tx) => ({
      date: format(new Date(tx.createdAt), "dd/MM", { locale: fr }),
      studentName: [tx.student.firstName, tx.student.lastName]
        .filter(Boolean)
        .join(" "),
      description: tx.description ?? null,
      amount: tx.amount,
      method: tx.method,
      status: tx.status as "PENDING" | "VALIDATED" | "CANCELED",
      transactionType: tx.transactionType as "CREDIT" | "DEBIT" | "DISCOUNT",
    }));

    const totalAmount = mappedTransactions.reduce((s, t) => s + t.amount, 0);
    const totalValidated = mappedTransactions
      .filter((t) => t.status === "VALIDATED")
      .reduce((s, t) => s + t.amount, 0);
    const totalPending = mappedTransactions
      .filter((t) => t.status === "PENDING")
      .reduce((s, t) => s + t.amount, 0);
    const totalCanceled = mappedTransactions
      .filter((t) => t.status === "CANCELED")
      .reduce((s, t) => s + t.amount, 0);

    const templateProps: TransactionsSummaryProps = {
      school: {
        name: school.name,
        logo: buildLogoUrl((school as { logo?: string | null }).logo, baseUrl),
      },
      periodLabel,
      periodType: resolvedPeriodType,
      transactions: mappedTransactions,
      totalAmount,
      totalValidated,
      totalPending,
      totalCanceled,
      transactionsUrl: `${baseUrl}/accounting/transactions`,
    };

    const [html, text] = await Promise.all([
      render(TransactionsSummary(templateProps)),
      render(TransactionsSummary(templateProps), { plainText: true }),
    ]);

    await caller.sesEmail.enqueue({
      jobs: [
        {
          to: user.email,
          from: "Discolaire <contact@discolaire.com>",
          subject: `${resolvedPeriodType === "friday" ? "Bilan hebdomadaire" : "Bilan des 3 derniers jours"} — ${school.name}`,
          html,
          text,
        },
      ],
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
