import { db } from "@repo/db";

import { studentService } from "./student-service";

export const transactionService = {
  getReceiptInfo: async (transactionId: number) => {
    const transaction = await db.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    const studentAccount = await db.studentAccount.findFirst({
      where: {
        id: transaction.accountId,
      },
    });
    if (!studentAccount) {
      throw new Error("Student account not found");
    }
    const student = await db.student.findUnique({
      where: {
        id: studentAccount.studentId,
      },
    });
    if (!student) {
      throw new Error("Student not found");
    }
    const classroom = await studentService.getClassroom(
      student.id,
      transaction.schoolYearId,
    );
    if (!classroom) {
      throw new Error("Student not register in any class");
    }
    const fees = await db.fee.findMany({
      where: {
        classroomId: classroom.id,
      },
    });
    const totalFee = fees.reduce((acc, fee) => acc + fee.amount, 0);
    const transactions = await db.transaction.findMany({
      where: {
        account: {
          studentId: student.id,
        },
        deletedAt: null,
        schoolYearId: transaction.schoolYearId,
      },
    });
    const paid = transactions.reduce((acc, t) => acc + t.amount, 0);
    const remaining = totalFee - paid;

    // Get the staff who created, printed and received the transaction
    const createdBy = transaction.createdById
      ? await db.staff.findUnique({ where: { id: transaction.createdById } })
      : null;
    const printedBy = transaction.printedById
      ? await db.staff.findUnique({ where: { id: transaction.printedById } })
      : null;
    const receivedBy = transaction.receivedById
      ? await db.staff.findUnique({ where: { id: transaction.receivedById } })
      : null;

    const school = await db.school.findUnique({
      where: {
        id: student.schoolId,
      },
    });

    if (!school) {
      throw new Error("School not found");
    }

    const studentContact = await db.studentContact.findMany({
      include: {
        contact: true,
      },
      where: {
        studentId: student.id,
      },
    });
    let contact = studentContact.find((c) => c.primaryContact)?.contact;
    if (!contact) {
      contact = studentContact[0]?.contact;
    }

    return {
      student,
      contact,
      remaining,
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
