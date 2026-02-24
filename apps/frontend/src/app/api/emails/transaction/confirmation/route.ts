import { render } from "@react-email/render";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import TransactionConfirmation from "@repo/transactional/emails/TransactionConfirmation";

import { getSession } from "~/auth/server";
import { caller, getQueryClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

const schema = z.object({
  transactionId: z.number(),
  studentId: z.string().min(1),
  remaining: z.number(),
  createdBy: z.string().min(1),
  status: z.string().min(1).default("success"),
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
    const { transactionId, studentId, remaining, createdBy, status } =
      result.data;

    const queryClient = getQueryClient();

    const transaction = await queryClient.fetchQuery(
      trpc.transaction.get.queryOptions(transactionId),
    );

    const student = await queryClient.fetchQuery(
      trpc.student.get.queryOptions(studentId),
    );

    const contacts = await queryClient.fetchQuery(
      trpc.student.contacts.queryOptions(transaction.studentId),
    );

    const destinationEmails = contacts
      .map((c) => {
        if (c.accessBilling || c.paysFee) {
          return c.contact.user?.email;
        }
      })
      .filter((email) => email != null);

    if (destinationEmails.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const t = await getTranslations();
    const school = await caller.school.getSchool();

    const html = await render(
      TransactionConfirmation({
        name: getFullName(student),
        amount: transaction.amount,
        remaining: remaining,
        createdBy: createdBy,
        status: t(status),
      }),
    );

    await caller.sesEmail.enqueue({
      jobs: destinationEmails.map((to) => ({
        to,
        from: "Discolaire <contact@discolaire.com>",
        subject: "Paiement " + school.name,
        html,
      })),
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
