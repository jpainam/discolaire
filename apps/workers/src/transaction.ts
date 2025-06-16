import { nanoid } from "nanoid";

import { transactionService } from "@repo/api/services";
import { db } from "@repo/db";
import TransactionConfirmation from "@repo/transactional/emails/TransactionConfirmation";

import { getFullName, resend } from "./utils";

export const transactionWorker = {
  create: async (transactionId: number) => {
    try {
      console.log(`Sending transaction notification id: ${transactionId}`);
      const { student, createdBy, transaction, school, remaining } =
        await transactionService.getReceiptInfo(transactionId);

      const contacts = await db.studentContact.findMany({
        include: {
          contact: {
            include: {
              user: true,
            },
          },
        },
        where: {
          studentId: transaction.account.studentId,
        },
      });
      const destinationEmails = contacts
        .map((c) => {
          if (c.accessBilling || c.paysFee) {
            return c.contact.user?.email;
          }
        })
        .filter((email) => email != "")
        .filter((email) => email != null);

      if (destinationEmails.length === 0) {
        console.log("No emails found for transaction confirmation");
        return;
      }

      const { error } = await resend.emails.send({
        from: `${school.name} <hi@discolaire.com>`,
        to: destinationEmails.filter((d) => d),
        subject: "Confirmation de paiement scolaire",
        headers: {
          "X-Entity-Ref-ID": nanoid(),
        },
        react: TransactionConfirmation({
          name: getFullName(student),
          amount: transaction.amount,
          remaining: remaining,
          createdBy: createdBy?.lastName ?? createdBy?.firstName ?? "N/A",
          status: transaction.status,
        }) as React.ReactElement,
      });
      if (error) {
        console.error(error);
      }
    } catch (e) {
      console.error(e);
    }
  },
};
