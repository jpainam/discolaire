import { endOfDay, format, startOfDay, subDays } from "date-fns";

import type { Prisma } from "@repo/db";
import { TransactionStatus, TransactionType } from "@repo/db/enums";

import { db } from "../db";
import { classroomService } from "./classroom-service";

async function getClassroom(studentId: string, schoolYearId: string) {
  const classroom = await db.classroom.findFirst({
    where: {
      enrollments: {
        some: {
          studentId: studentId,
          schoolYearId: schoolYearId,
        },
      },
    },
  });
  if (!classroom) {
    return null;
  }
  return classroomService.get(classroom.id, classroom.schoolId);
}

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

    const classroom = await getClassroom(
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

export async function getLastDaysDailySummary({
  schoolYearId,
  days,
}: {
  schoolYearId: string;
  days: number;
}) {
  const to = endOfDay(new Date());
  const from = startOfDay(subDays(to, days)); // 60 days window (today + prior 59)

  const transactions = await db.transaction.findMany({
    where: {
      createdAt: { gte: from, lte: to },

      schoolYearId,
    },
    select: {
      amount: true,
      createdAt: true,
      status: true, // PENDING / VALIDATED
      transactionType: true, // CREDIT / DEBIT / DISCOUNT
      deletedAt: true, // null or Date
    },
    orderBy: { createdAt: "asc" },
  });

  const daysMap = new Map<
    string,
    {
      date: string; // 'yyyy-MM-dd'
      pending: number; // CREDIT only, status=PENDING, non-deleted
      validated: number; // CREDIT only, status=VALIDATED, non-deleted
      deleted: number; // ALL types when deletedAt != null
    }
  >();

  for (const t of transactions) {
    const key = format(t.createdAt, "yyyy-MM-dd");
    let bucket = daysMap.get(key);
    if (!bucket) {
      bucket = { date: key, pending: 0, validated: 0, deleted: 0 };
      daysMap.set(key, bucket);
    }

    if (t.deletedAt) {
      // Count all types for deleted
      bucket.deleted += t.amount;
      continue;
    }

    // Non-deleted: only CREDIT contributes to pending/validated
    if (t.transactionType === TransactionType.CREDIT) {
      if (t.status === TransactionStatus.PENDING) {
        bucket.pending += t.amount;
      } else if (t.status === TransactionStatus.VALIDATED) {
        bucket.validated += t.amount;
      }
    }
  }

  // Convert to array, drop zero-only days, and sort ascending
  return Array.from(daysMap.values())
    .filter((d) => d.pending !== 0 || d.validated !== 0 || d.deleted !== 0)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
