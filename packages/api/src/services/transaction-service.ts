import type { Prisma } from "@repo/db";
import { TransactionType } from "@repo/db/enums";

import { db } from "../db";
import { classroomService } from "./classroom-service";
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

export async function getTransactionStats({
  from,
  to,
  journalId,
  classroomId,
  schoolYearId,
}: {
  from: Date | null;
  to: Date | null;
  journalId: string | null;
  classroomId: string | null;
  schoolYearId: string;
}) {
  const currentFees = await db.fee.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      ...(journalId ? { journalId: journalId } : {}),
      ...(classroomId ? { classroomId: classroomId } : {}),
      ...(from ? { createdAt: { gte: from } } : {}),
      ...(to ? { createdAt: { lte: to } } : {}),
      classroom: {
        schoolYearId: schoolYearId,
      },
    },
  });
  let studentIds: string[] = [];
  if (classroomId) {
    const students = await classroomService.getStudents(classroomId);
    studentIds = students.map((s) => s.id);
  }
  const whereClause: Prisma.TransactionWhereInput = {
    ...(from ? { createdAt: { gte: from } } : {}),
    ...(to ? { createdAt: { lte: to } } : {}),
    ...(classroomId ? { studentId: { in: studentIds } } : {}),
    ...(journalId ? { journalId: journalId } : {}),
    schoolYearId: schoolYearId,
    deletedAt: null,
    status: "VALIDATED",
  };
  const totalCompleted = await db.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: whereClause,
  });
  const totalInProgress = await db.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      ...whereClause,
      status: "PENDING",
    },
  });

  const totalDeleted = await db.transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      ...whereClause,
      deletedAt: {
        not: null,
      },
    },
  });
  return {
    totalFee: currentFees._sum.amount ?? 0,
    totalCompleted: totalCompleted._sum.amount ?? 0,
    totalInProgress: totalInProgress._sum.amount ?? 0,
    totalDeleted: totalDeleted._sum.amount ?? 0,
    increased: true,
    percentage: 4.4,
  };
}

export async function getTransactionTrends({
  from,
  to,
  schoolYearId,
  classroomId,
  journalId,
}: {
  from: Date | null;
  to: Date | null;
  schoolYearId: string;
  classroomId: string | null;
  journalId: string | null;
}) {
  let studentIds: string[] = [];
  if (classroomId) {
    const students = await classroomService.getStudents(classroomId);
    studentIds = students.map((s) => s.id);
  }
  const result = await db.transaction.groupBy({
    where: {
      ...(from ? { createdAt: { gte: from } } : {}),
      ...(to ? { createdAt: { lte: to } } : {}),
      ...(classroomId ? { studentId: { in: studentIds } } : {}),
      ...(journalId ? { journalId: journalId } : {}),
      schoolYearId: schoolYearId,
      deletedAt: null,
    },
    by: ["createdAt"],
    _sum: {
      amount: true,
    },
  });
  const resultMap: Record<string, number> = {};
  const dateFormat = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  result.forEach((item) => {
    const key = dateFormat.format(item.createdAt);
    resultMap[key] = (resultMap[key] ?? 0) + (item._sum.amount ?? 0);
  });
  return Object.keys(resultMap).map((item) => ({
    date: item,
    amount: resultMap[item],
  }));
}
