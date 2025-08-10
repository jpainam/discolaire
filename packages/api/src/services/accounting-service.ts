import { db, TransactionType } from "@repo/db";

export async function getUnpaidFeeDescription(
  studentId: string,
  classroomId: string,
) {
  const student = await db.student.findUniqueOrThrow({
    where: {
      id: studentId,
    },
  });
  const fees = await db.fee.findMany({
    where: {
      classroomId: classroomId,
      journal: {
        requiredJournals: {
          some: {
            schoolId: student.schoolId,
          },
        },
      },
    },
    include: {
      journal: true,
    },
  });
  const amountDue = fees.reduce((acc, fee) => acc + fee.amount, 0);
  const journalIds = fees
    .map((fee) => fee.journalId)
    .filter((id) => id !== null);
  const transactions = await db.transaction.findMany({
    where: {
      journalId: {
        in: journalIds,
      },
    },
  });
  const credit = transactions
    .filter((t) => t.transactionType === TransactionType.CREDIT)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const debit = transactions
    .filter((t) => t.transactionType === TransactionType.DEBIT)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const discount = transactions
    .filter((t) => t.transactionType === TransactionType.DISCOUNT)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const total = credit + discount - debit;

  return {
    paid: total,
    unpaid: amountDue - total,
    journalIds: journalIds,
    journal: fees.map((fee) => fee.journal?.name).join(", "),
  };
}
