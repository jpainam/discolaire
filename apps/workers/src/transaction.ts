import { nanoid } from "nanoid";

import { transactionService } from "@repo/api/services";
import { db } from "@repo/db";
import { TransactionConfirmation } from "@repo/transactional";

import { getFullName, resend } from "./utils";

export const transactionWorker = {
  create: async (transactionId: number) => {
    console.log(`Creating transaction with id: ${transactionId}`);
    const { student, createdBy, transaction, school, remaining } =
      await transactionService.getReceiptInfo(transactionId);

    const contacts = await db.studentContact.findMany({
      include: {
        contact: true,
      },
      where: {
        studentId: transaction.account.studentId,
      },
    });
    const destinationEmails = contacts
      .map((c) => {
        if (c.accessBilling || c.paysFee) {
          return c.contact.email;
        }
      })
      .filter((email) => email != null);

    const { error } = await resend.emails.send({
      from: `${school.name} <no-reply@discolaire.com>`,
      to: destinationEmails,
      subject: "Confirmation de paiement scolaire",
      headers: {
        "X-Entity-Ref-ID": nanoid(),
      },
      react: TransactionConfirmation({
        studentName: getFullName(student),
        school: {
          logo: school.logo ?? "",
          name: school.name,
          id: school.id,
        },
        paymentAmount: transaction.amount,
        remainingBalance: remaining,
        paymentRecorder: createdBy?.lastName ?? createdBy?.firstName ?? "N/A",
        title: "Validation de paiement scolaire",
        paymentStatus: transaction.status,
      }) as React.ReactElement,
    });
    if (error) {
      console.error(error);
    }
  },
};
