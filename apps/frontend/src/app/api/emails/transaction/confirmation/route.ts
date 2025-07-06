/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import TransactionConfirmation from "@repo/transactional/emails/TransactionConfirmation";
import { getServerTranslations } from "~/i18n/server";

import { db } from "@repo/db";
import { nanoid } from "nanoid";
import { getSession } from "~/auth/server";
import { resend } from "~/lib/resend";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

const schema = z.object({
  transactionId: z.coerce.number(),
  studentId: z.string().min(1),
  remaining: z.coerce.number(),
  createdBy: z.string().min(1),
  status: z.string().min(1).default("success"),
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
    const { transactionId, studentId, remaining, createdBy, status } =
      result.data;

    const transaction = await caller.transaction.get(transactionId);

    const student = await caller.student.get(studentId);

    const contacts = await db.studentContact.findMany({
      include: {
        contact: {
          include: {
            user: true,
          },
        },
      },
      where: {
        studentId: transaction.studentId,
      },
    });
    const destinationEmails = contacts
      .map((c) => {
        if (c.accessBilling || c.paysFee) {
          return c.contact.user?.email;
        }
      })
      .filter((email) => email != null);

    const { t } = await getServerTranslations();
    const school = await caller.school.getSchool();

    const { error } = await resend.emails.send({
      from: "Confirmation de Paiement <hi@discolaire.com>",
      to: destinationEmails,
      subject: "Paiement " + school.name,
      headers: {
        "X-Entity-Ref-ID": nanoid(),
      },
      react: TransactionConfirmation({
        name: getFullName(student),
        amount: transaction.amount,
        remaining: remaining,
        createdBy: createdBy,
        status: t(status),
      }) as React.ReactElement,
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
