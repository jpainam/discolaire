import { render } from "@react-email/render";
import { z } from "zod/v4";

import { TransactionValidatedEmail } from "@repo/transactional/emails/TransactionValidatedEmail";

import { getSession } from "~/auth/server";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { caller, getQueryClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

export const runtime = "nodejs";

const schema = z.object({
  transactionId: z.number(),
  studentId: z.string().min(1),
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

    const { transactionId, studentId } = result.data;

    const queryClient = getQueryClient();

    const [transaction, student, contacts, school, baseUrl] = await Promise.all(
      [
        queryClient.fetchQuery(
          trpc.transaction.get.queryOptions(transactionId),
        ),
        queryClient.fetchQuery(trpc.student.get.queryOptions(studentId)),
        queryClient.fetchQuery(trpc.student.contacts.queryOptions(studentId)),
        caller.school.getSchool(),
        getRequestBaseUrl(),
      ],
    );

    const destinationEmails = contacts
      .map((c) => {
        if (c.accessBilling || c.paysFee) {
          return c.contact.user?.email;
        }
      })
      .filter((email): email is string => email != null);

    if (destinationEmails.length === 0) {
      return Response.json({ success: true, sent: 0 }, { status: 200 });
    }

    const transactionsUrl = `${baseUrl}/students/${studentId}/transactions`;

    const html = await render(
      TransactionValidatedEmail({
        studentName: getFullName(student),
        amount: transaction.amount,
        transactionRef: transaction.transactionRef ?? "",
        school: { id: school.id, name: school.name, logo: school.logo },
        transactionsUrl,
      }),
    );

    await caller.sesEmail.enqueue({
      jobs: destinationEmails.map((to) => ({
        to,
        from: `${school.code} <contact@discolaire.com>`,
        subject: `Paiement validé - ${getFullName(student)} | ${school.name}`,
        html,
      })),
    });

    return Response.json(
      { success: true, sent: destinationEmails.length },
      { status: 200 },
    );
  } catch (e) {
    console.error("[api/emails/transaction/validated]", e);
    return new Response("An error occurred", { status: 500 });
  }
}
