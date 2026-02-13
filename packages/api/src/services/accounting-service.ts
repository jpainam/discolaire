import type { PrismaClient } from "@repo/db";

import { BillingService } from "./billing-service";

export class AccountingService {
  private db: PrismaClient;
  private billing: BillingService;
  constructor(db: PrismaClient) {
    this.db = db;
    this.billing = new BillingService(db);
  }
  async getUnpaidFeeDescription(studentId: string, classroomId: string) {
    const classroom = await this.db.classroom.findUniqueOrThrow({
      where: {
        id: classroomId,
      },
    });
    const requiredJournals = await this.db.requiredAccountingJournal.findMany({
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
    const fees = await this.db.fee.findMany({
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

    const transactions = await this.db.transaction.findMany({
      where: {
        studentId: studentId,
        deletedAt: null,
        journalId: {
          in: journalIds,
        },
      },
    });
    const txSummary = this.billing.summarizeTransactions(
      transactions.map((tx) => ({
        amount: tx.amount,
        transactionType: tx.transactionType,
      })),
    );
    const eligibilityContext = await this.billing.buildEligibilityContext({
      studentId,
      schoolId: classroom.schoolId,
      schoolYearId: classroom.schoolYearId,
    });
    const autoDiscount = await this.billing.computeAutomaticDiscount({
      schoolId: classroom.schoolId,
      schoolYearId: classroom.schoolYearId,
      classroomId,
      feeTotal: amountDue,
      eligibilityContext,
    });
    const total = txSummary.net + autoDiscount.amount;

    return {
      paid: total,
      unpaid: amountDue - total < 0 ? 0 : amountDue - total,
      journalIds: journalIds,
      journal: fees.map((fee) => fee.journal?.name).join(", "),
    };
  }
}
