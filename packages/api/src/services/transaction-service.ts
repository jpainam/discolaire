import { db, TransactionType } from "@repo/db";

import { studentService } from "./student-service";

export const transactionService = {
  getReceiptInfo: async (transactionId: number) => {
    const transaction = await db.transaction.findUniqueOrThrow({
      include: {
        student: true,
        journal: true,
      },
      where: {
        id: transactionId,
      },
    });

    const classroom = await studentService.getClassroom(
      transaction.studentId,
      transaction.schoolYearId,
    );
    if (!classroom) {
      throw new Error("Student not register in any class");
    }
    const fees = await db.fee.findMany({
      include: {
        journal: true,
      },
      where: {
        classroomId: classroom.id,
        journalId: transaction.journalId,
      },
    });
    const totalFee = fees.reduce((acc, fee) => acc + fee.amount, 0);
    const transactions = await db.transaction.findMany({
      where: {
        studentId: transaction.studentId,
        deletedAt: null,
        schoolYearId: transaction.schoolYearId,
        journalId: transaction.journalId,
      },
    });
    const paid = transactions.reduce((acc, t) => acc + t.amount, 0);
    const remaining = totalFee - paid;

    // Get the staff who created, printed and received the transaction
    const createdBy = transaction.createdById
      ? await db.staff.findFirst({
          where: { user: { id: transaction.createdById } },
        })
      : null;
    const printedBy = transaction.printedById
      ? await db.staff.findFirst({
          where: { user: { id: transaction.printedById } },
        })
      : null;
    const receivedBy = transaction.receivedById
      ? await db.staff.findFirst({
          where: { user: { id: transaction.receivedById } },
        })
      : null;

    const school = await db.school.findUniqueOrThrow({
      where: {
        id: classroom.schoolId,
      },
    });

    const studentContact = await db.studentContact.findMany({
      include: {
        contact: true,
      },
      where: {
        studentId: transaction.studentId,
      },
    });
    let contact = studentContact.find((c) => c.primaryContact)?.contact;

    contact ??= studentContact[0]?.contact;

    return {
      student: transaction.student,
      contact: contact ?? null,
      remaining,
      journal: transaction.journal,
      totalFee,
      school,
      classroom,
      transaction,
      createdBy,
      printedBy,
      receivedBy,
    };
  },
};

export async function getTransactionSummary({
  from,
  to,
  schoolId,
  schoolYearId,
}: {
  from: Date;
  to: Date;
  schoolId: string;
  schoolYearId: string;
}) {
  const transactions = await db.transaction.findMany({
    where: {
      createdAt: {
        gte: from,
        lte: to,
      },
      deletedAt: null,
    },
    include: {
      journal: true,
      student: true,
    },
  });
  let totalCredit = 0;
  let totalDebit = 0;
  let totalDiscount = 0;
  const lastTransactions = [];
  for (const transaction of transactions) {
    if (transaction.transactionType === TransactionType.CREDIT) {
      totalCredit += transaction.amount;
    } else if (transaction.transactionType === TransactionType.DEBIT) {
      totalDebit += Math.abs(transaction.amount);
    } else {
      totalDiscount += transaction.amount;
    }
    const student = await studentService.get(
      transaction.studentId,
      schoolYearId,
      schoolId,
    );
    lastTransactions.push({
      id: transaction.id,
      student: {
        id: student.id,
        lastName: student.lastName,
        firstName: student.firstName,
        classroom: student.classroom,
      },
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      createdAt: transaction.createdAt,
    });
  }

  return {
    revenue: totalCredit - totalDebit - totalDiscount,
    numberOfTransactions: transactions.length,
    totalCredit: totalCredit,
    totalDebit: totalDebit,
    totalDiscount: totalDiscount,
    lastTransactions: lastTransactions,
  };
}
