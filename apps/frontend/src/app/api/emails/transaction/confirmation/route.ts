/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { render } from "@react-email/render";
import { z } from "zod";

import { auth } from "@repo/auth";
import { TransactionConfirmation } from "@repo/transactional";
import { getServerTranslations } from "~/i18n/server";

import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

const schema = z.object({
  transactionId: z.coerce.number(),
  studentId: z.string().min(1),
  remaining: z.coerce.number(),
  createdBy: z.string().min(1),
  status: z.string().min(1).default("success"),
});
export async function POST(req: Request) {
  try {
    const session = await auth();
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

    const transaction = await api.transaction.get(transactionId);

    const student = await api.student.get(studentId);

    const studentContacts = await api.student.contacts(
      transaction.account.studentId
    );
    if (studentContacts.length === 0) {
      return new Response("Student has no contact", { status: 404 });
    }
    let studentContact = studentContacts.find((std) => std.primaryContact);

    if (!studentContact) {
      studentContact = studentContacts[0];
    }
    const contact = studentContact?.contact;

    const { t } = await getServerTranslations();
    const school = await api.school.getSchool();

    if (contact?.email) {
      const emailHtml = await render(
        TransactionConfirmation({
          studentName: getFullName(student),
          school: {
            logo: school.logo ?? "",
            name: school.name,
            id: school.id,
          },
          paymentAmount: transaction.amount,
          remainingBalance: remaining,
          paymentRecorder: createdBy,
          title: "",
          paymentStatus: t(status),
        })
      );
      await api.messaging.sendEmail({
        subject: t("transaction_confirmation"),
        to: contact.email,
        body: emailHtml,
      });
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(`An error occurred`, { status: 500 });
  }
}
