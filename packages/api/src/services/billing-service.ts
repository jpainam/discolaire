import type { Prisma, PrismaClient } from "@repo/db";
import {
  DiscountAssignmentSource,
  DiscountAssignmentStatus,
  DiscountCriterionType,
  DiscountValueType,
  TransactionType,
} from "@repo/db/enums";

type TransactionLike = {
  amount: number;
  transactionType: TransactionType;
};

type DiscountConfig = {
  minChildren?: number;
  religionId?: string;
  religionName?: string;
  isBaptized?: boolean;
};

export type BillingTransactionSummary = {
  credit: number;
  debit: number;
  manualDiscount: number;
  net: number;
};

export type DiscountEligibilityContext = {
  studentId: string;
  schoolId: string;
  schoolYearId: string;
  siblingCount: number;
  isStaffChild: boolean;
  religionId: string | null;
  religionName: string | null;
  isBaptized: boolean;
};

export type AppliedAutomaticDiscount = {
  policyId: string;
  name: string;
  amount: number;
  valueType: DiscountValueType;
  value: number;
};

type ApplicablePolicy = Awaited<
  ReturnType<BillingService["getApplicablePolicies"]>
>[number];

export class BillingService {
  private db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  summarizeTransactions(
    transactions: TransactionLike[],
  ): BillingTransactionSummary {
    let credit = 0;
    let debit = 0;
    let manualDiscount = 0;

    for (const tx of transactions) {
      if (tx.transactionType === TransactionType.CREDIT) {
        credit += tx.amount;
      } else if (tx.transactionType === TransactionType.DEBIT) {
        debit += tx.amount;
      } else if (tx.transactionType === TransactionType.DISCOUNT) {
        manualDiscount += tx.amount;
      }
    }

    return {
      credit,
      debit,
      manualDiscount,
      net: credit + manualDiscount - debit,
    };
  }

  async buildEligibilityContext({
    studentId,
    schoolId,
    schoolYearId,
  }: {
    studentId: string;
    schoolId: string;
    schoolYearId: string;
  }): Promise<DiscountEligibilityContext> {
    const student = await this.db.student.findUniqueOrThrow({
      where: { id: studentId },
      select: {
        id: true,
        religionId: true,
        isBaptized: true,
        religion: { select: { name: true } },
      },
    });

    const payerContacts = await this.db.studentContact.findMany({
      where: {
        studentId,
        paysFee: true,
      },
      select: {
        contactId: true,
        contact: {
          select: {
            userId: true,
          },
        },
      },
    });

    const payerContactIds = Array.from(
      new Set(payerContacts.map((item) => item.contactId)),
    );
    const payerUserIds = Array.from(
      new Set(
        payerContacts
          .map((item) => item.contact.userId)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    let siblingCount = 1;
    if (payerContactIds.length > 0) {
      const linkedStudents = await this.db.studentContact.findMany({
        where: {
          contactId: { in: payerContactIds },
          paysFee: true,
        },
        select: {
          studentId: true,
        },
      });
      const linkedStudentIds = Array.from(
        new Set(linkedStudents.map((item) => item.studentId)),
      );
      if (linkedStudentIds.length > 0) {
        const enrolled = await this.db.enrollment.findMany({
          where: {
            schoolYearId,
            studentId: { in: linkedStudentIds },
            classroom: {
              schoolId,
            },
          },
          select: {
            studentId: true,
          },
        });
        const enrolledStudentIds = new Set(
          enrolled.map((item) => item.studentId),
        );
        siblingCount = Math.max(enrolledStudentIds.size, 1);
      }
    }

    const isStaffChild =
      payerUserIds.length > 0
        ? Boolean(
            await this.db.staff.findFirst({
              where: {
                schoolId,
                userId: { in: payerUserIds },
              },
              select: {
                id: true,
              },
            }),
          )
        : false;

    return {
      studentId: student.id,
      schoolId,
      schoolYearId,
      siblingCount,
      isStaffChild,
      religionId: student.religionId ?? null,
      religionName: student.religion?.name ?? null,
      isBaptized: student.isBaptized,
    };
  }

  async computeAutomaticDiscount({
    schoolId,
    schoolYearId,
    classroomId,
    feeTotal,
    asOf = new Date(),
    eligibilityContext,
  }: {
    schoolId: string;
    schoolYearId: string;
    classroomId: string | null;
    feeTotal: number;
    asOf?: Date;
    eligibilityContext: DiscountEligibilityContext;
  }) {
    if (feeTotal <= 0) {
      return {
        amount: 0,
        appliedPolicies: [] as AppliedAutomaticDiscount[],
      };
    }

    const policies = await this.getApplicablePolicies({
      schoolId,
      schoolYearId,
      classroomId,
      asOf,
    });
    const assignments = await this.db.discountPolicyAssignment.findMany({
      where: {
        studentId: eligibilityContext.studentId,
        policyId: {
          in: policies.map((policy) => policy.id),
        },
      },
      select: {
        policyId: true,
        status: true,
      },
    });
    const assignmentByPolicyId = new Map(
      assignments.map((assignment) => [assignment.policyId, assignment]),
    );

    let totalDiscount = 0;
    const appliedPolicies: AppliedAutomaticDiscount[] = [];

    for (const policy of policies) {
      const assignment = assignmentByPolicyId.get(policy.id);
      const isDenied = assignment?.status === DiscountAssignmentStatus.DENY;
      if (isDenied) {
        continue;
      }
      const isAllowed =
        assignment?.status === DiscountAssignmentStatus.ALLOW
          ? true
          : this.policyMatches(policy, eligibilityContext);
      if (!isAllowed) {
        continue;
      }
      if (!policy.stackable && totalDiscount > 0) {
        continue;
      }

      const amount = this.computePolicyAmount(policy, feeTotal);
      if (amount <= 0) {
        continue;
      }

      const remaining = Math.max(feeTotal - totalDiscount, 0);
      if (remaining <= 0) {
        break;
      }

      const appliedAmount = Math.min(amount, remaining);
      if (appliedAmount <= 0) {
        continue;
      }

      totalDiscount += appliedAmount;
      appliedPolicies.push({
        policyId: policy.id,
        name: policy.name,
        amount: appliedAmount,
        valueType: policy.valueType,
        value: policy.value,
      });

      if (!policy.stackable) {
        break;
      }
    }

    return {
      amount: totalDiscount,
      appliedPolicies,
    };
  }

  async syncAutoDiscountAssignmentsForStudent({
    studentId,
    schoolId,
    schoolYearId,
    trigger,
  }: {
    studentId: string;
    schoolId: string;
    schoolYearId: string;
    trigger: "STUDENT_CREATED" | "STUDENT_UPDATED" | "CONTACT_LINKED";
  }) {
    const eligibilityContext = await this.buildEligibilityContext({
      studentId,
      schoolId,
      schoolYearId,
    });
    const classroomIds = await this.getStudentClassroomIds({
      studentId,
      schoolYearId,
      schoolId,
    });
    const policies = await this.getPoliciesForAssignmentSync({
      schoolId,
      schoolYearId,
      classroomIds,
      asOf: new Date(),
    });
    for (const policy of policies) {
      if (!this.policyMatches(policy, eligibilityContext)) {
        continue;
      }
      await this.ensureAutoAllowAssignment({
        policyId: policy.id,
        studentId,
        note: `auto:${trigger}`,
        metadata: {
          trigger,
          siblingCount: eligibilityContext.siblingCount,
          isStaffChild: eligibilityContext.isStaffChild,
          religionId: eligibilityContext.religionId,
        },
      });
    }
  }

  async syncAutoDiscountAssignmentsForContacts({
    contactIds,
    schoolId,
    schoolYearId,
  }: {
    contactIds: string[];
    schoolId: string;
    schoolYearId: string;
  }) {
    const normalized = Array.from(
      new Set(contactIds.map((id) => id.trim()).filter(Boolean)),
    );
    if (normalized.length === 0) {
      return;
    }
    const linked = await this.db.studentContact.findMany({
      where: {
        contactId: { in: normalized },
        paysFee: true,
      },
      select: {
        studentId: true,
      },
    });
    const studentIds = Array.from(new Set(linked.map((row) => row.studentId)));
    for (const studentId of studentIds) {
      await this.syncAutoDiscountAssignmentsForStudent({
        studentId,
        schoolId,
        schoolYearId,
        trigger: "CONTACT_LINKED",
      });
    }
  }

  async setManualAssignment({
    policyId,
    studentId,
    status,
    note,
  }: {
    policyId: string;
    studentId: string;
    status: DiscountAssignmentStatus;
    note?: string;
  }) {
    return this.db.discountPolicyAssignment.upsert({
      where: {
        policyId_studentId: {
          policyId,
          studentId,
        },
      },
      update: {
        status,
        source: DiscountAssignmentSource.MANUAL,
        note,
      },
      create: {
        policyId,
        studentId,
        status,
        source: DiscountAssignmentSource.MANUAL,
        note,
      },
    });
  }

  async clearManualAssignment({
    policyId,
    studentId,
  }: {
    policyId: string;
    studentId: string;
  }) {
    const assignment = await this.db.discountPolicyAssignment.findUnique({
      where: {
        policyId_studentId: {
          policyId,
          studentId,
        },
      },
    });
    if (!assignment || assignment.source !== DiscountAssignmentSource.MANUAL) {
      return assignment;
    }
    return this.db.discountPolicyAssignment.delete({
      where: {
        policyId_studentId: {
          policyId,
          studentId,
        },
      },
    });
  }

  private async getApplicablePolicies({
    schoolId,
    schoolYearId,
    classroomId,
    asOf,
  }: {
    schoolId: string;
    schoolYearId: string;
    classroomId: string | null;
    asOf: Date;
  }) {
    return this.db.discountPolicy.findMany({
      where: {
        schoolId,
        isActive: true,
        AND: [
          {
            OR: [{ activeFrom: null }, { activeFrom: { lte: asOf } }],
          },
          {
            OR: [{ activeTo: null }, { activeTo: { gte: asOf } }],
          },
          {
            OR: [{ schoolYearId: null }, { schoolYearId }],
          },
          classroomId
            ? {
                OR: [{ classroomId: null }, { classroomId }],
              }
            : { classroomId: null },
        ],
      },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    });
  }

  private async getPoliciesForAssignmentSync({
    schoolId,
    schoolYearId,
    classroomIds,
    asOf,
  }: {
    schoolId: string;
    schoolYearId: string;
    classroomIds: string[];
    asOf: Date;
  }) {
    return this.db.discountPolicy.findMany({
      where: {
        schoolId,
        isActive: true,
        AND: [
          {
            OR: [{ activeFrom: null }, { activeFrom: { lte: asOf } }],
          },
          {
            OR: [{ activeTo: null }, { activeTo: { gte: asOf } }],
          },
          {
            OR: [{ schoolYearId: null }, { schoolYearId }],
          },
          {
            OR:
              classroomIds.length > 0
                ? [{ classroomId: null }, { classroomId: { in: classroomIds } }]
                : [{ classroomId: null }],
          },
        ],
      },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    });
  }

  private policyMatches(
    policy: Pick<ApplicablePolicy, "criterionType" | "criterionConfig">,
    context: DiscountEligibilityContext,
  ) {
    const config = (policy.criterionConfig ?? {}) as DiscountConfig;

    switch (policy.criterionType) {
      case DiscountCriterionType.ALWAYS:
        return true;
      case DiscountCriterionType.SIBLING_COUNT: {
        const minChildren =
          typeof config.minChildren === "number" ? config.minChildren : 2;
        return context.siblingCount >= minChildren;
      }
      case DiscountCriterionType.STAFF_CHILD:
        return context.isStaffChild;
      case DiscountCriterionType.RELIGION: {
        if (config.religionId) {
          return context.religionId === config.religionId;
        }
        if (config.religionName) {
          return (
            (context.religionName ?? "").trim().toLowerCase() ===
            config.religionName.trim().toLowerCase()
          );
        }
        if (typeof config.isBaptized === "boolean") {
          return context.isBaptized === config.isBaptized;
        }
        return false;
      }
      default:
        return false;
    }
  }

  private computePolicyAmount(
    policy: {
      valueType: DiscountValueType;
      value: number;
      maxAmount: number | null;
    },
    feeTotal: number,
  ) {
    const raw =
      policy.valueType === DiscountValueType.PERCENT
        ? (feeTotal * policy.value) / 100
        : policy.value;
    const nonNegative = Math.max(raw, 0);
    const capped =
      policy.maxAmount == null
        ? nonNegative
        : Math.min(nonNegative, Math.max(policy.maxAmount, 0));
    return capped;
  }

  private async getStudentClassroomIds({
    studentId,
    schoolYearId,
    schoolId,
  }: {
    studentId: string;
    schoolYearId: string;
    schoolId: string;
  }) {
    const enrollments = await this.db.enrollment.findMany({
      where: {
        studentId,
        schoolYearId,
        classroom: {
          schoolId,
        },
      },
      select: {
        classroomId: true,
      },
    });
    return Array.from(new Set(enrollments.map((row) => row.classroomId)));
  }

  private async ensureAutoAllowAssignment({
    policyId,
    studentId,
    note,
    metadata,
  }: {
    policyId: string;
    studentId: string;
    note?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    const existing = await this.db.discountPolicyAssignment.findUnique({
      where: {
        policyId_studentId: {
          policyId,
          studentId,
        },
      },
      select: {
        id: true,
        source: true,
        status: true,
      },
    });
    if (!existing) {
      return this.db.discountPolicyAssignment.create({
        data: {
          policyId,
          studentId,
          source: DiscountAssignmentSource.AUTO,
          status: DiscountAssignmentStatus.ALLOW,
          note,
          metadata,
        },
      });
    }
    if (existing.source === DiscountAssignmentSource.MANUAL) {
      return existing;
    }
    if (existing.status === DiscountAssignmentStatus.DENY) {
      return existing;
    }
    return this.db.discountPolicyAssignment.update({
      where: { id: existing.id },
      data: {
        source: DiscountAssignmentSource.AUTO,
        status: DiscountAssignmentStatus.ALLOW,
        note,
        metadata,
      },
    });
  }
}
