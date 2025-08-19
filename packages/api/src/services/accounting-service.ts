import { db, TransactionType } from "@repo/db";

export async function getUnpaidFeeDescription(
  studentId: string,
  classroomId: string,
) {
  const classroom = await db.classroom.findUniqueOrThrow({
    where: {
      id: classroomId,
    },
  });
  const requiredJournals = await db.requiredAccountingJournal.findMany({
    where: {
      schoolId: classroom.schoolId,
      journal: {
        schoolYearId: classroom.schoolYearId,
      },
    },
    include: {
      journal: true,
    },
  });
  const journalIds = requiredJournals.map((journal) => journal.journalId);
  const fees = await db.fee.findMany({
    where: {
      classroomId: classroomId,
      journalId: {
        in: journalIds,
      },
    },
    include: {
      journal: true,
    },
  });
  if (fees.length === 0) {
    return {
      paid: 0,
      unpaid: 0,
      journalIds: journalIds,
      journal: fees.map((fee) => fee.journal?.name).join(", "),
    };
  }
  const amountDue = fees.reduce((acc, fee) => acc + fee.amount, 0);

  const transactions = await db.transaction.findMany({
    where: {
      studentId: studentId,
      deletedAt: null,
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
    unpaid: amountDue - total < 0 ? 0 : amountDue - total,
    journalIds: journalIds,
    journal: fees.map((fee) => fee.journal?.name).join(", "),
  };
}
