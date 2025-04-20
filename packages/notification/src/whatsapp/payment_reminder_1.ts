import { db } from "@repo/db";

import { env } from "../env";

export async function sendPaymentReminder({
  studentId,
  schoolYearId,
  dueDate,
}: {
  studentId: string;
  schoolYearId: string;
  dueDate: string;
}) {
  // send a whatsapp message using facebook graph api, the message is like that
  //Rappel de paiement
  // Cher parent de l'élève {{student}}  de la classe de {{classroom}}. Bien vouloir s'acquitter des frais {{fee}} {{amount}} dont la date est fixée ce {{due_date}}. Passé ce delai, l'administration de l'établissement sera dans l'obligation de le mettre hors des cours.

  const student = await db.student.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });
  const enrollment = await db.enrollment.findFirstOrThrow({
    where: {
      studentId: student.id,
      schoolYearId: schoolYearId,
    },
    include: {
      classroom: true,
    },
  });

  const classroom = enrollment.classroom;
  const fee = await db.fee.findMany({
    where: {
      classroomId: classroom.id,
    },
  });
  const totalDueFees = fee.reduce((acc, fee) => {
    const dueDate = new Date(fee.dueDate);
    const currentDate = new Date();
    if (dueDate < currentDate) {
      return acc + fee.amount;
    }
    return acc;
  }, 0);
  const transactions = await db.transaction.findMany({
    where: {
      account: {
        studentId: student.id,
      },
      schoolYearId: schoolYearId,
    },
  });
  const total_paid = transactions.reduce((acc, transaction) => {
    if (transaction.transactionType === "DEBIT") {
      return acc - transaction.amount;
    } else {
      return acc + transaction.amount;
    }
  }, 0);
  const amount = totalDueFees - total_paid;
  if (amount <= 0) {
    console.log("No payment reminder needed");
    return;
  }
  const parents = await db.studentContact.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      contact: true,
    },
  });
  console.log(">>>Parents", parents);

  const phoneNumber = "+15183689728";
  const businessPhoneNumberId = env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID;
  const message = `Rappel de paiement\nCher parent de l'élève ${student.lastName} de la classe de ${classroom.name}. Bien vouloir s'acquitter des frais ${amount} dont la date est fixée ce ${dueDate}. Passé ce delai, l'administration de l'établissement sera dans l'obligation de le mettre hors des cours.`;
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${businessPhoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        text: { body: message },
      }),
    },
  );
  if (!response.ok) {
    console.error("Error sending message:", response.statusText);
    throw new Error("Error sending message");
  }
  const data = await response.json();
  console.log("Message sent:", data);
  return data;
}
