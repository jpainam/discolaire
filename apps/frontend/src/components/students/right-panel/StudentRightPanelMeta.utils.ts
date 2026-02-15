import type { RouterOutputs } from "@repo/api";

export type StudentData = RouterOutputs["student"]["get"];
type GradeData = RouterOutputs["student"]["grades"][number];
type AttendanceData = RouterOutputs["attendance"]["student"][number];
type StatementData = RouterOutputs["student"]["getStatements"][number];
type ContactData = RouterOutputs["student"]["contacts"][number];
type DocumentData = RouterOutputs["student"]["documents"][number];
type ActivityData = RouterOutputs["student"]["activities"][number];

export type BadgeVariant = "success" | "warning" | "danger" | "neutral";

export interface SubjectScoreSummary {
  name: string;
  average: number;
}

export interface AcademicSummary {
  gradeCount: number;
  currentAverage: number | null;
  strongestSubject: SubjectScoreSummary | null;
  weakestSubject: SubjectScoreSummary | null;
  averageBadge: {
    variant: BadgeVariant;
    text: string;
  } | null;
}

export interface AttendanceSummary {
  justifiedAbsences: number;
  unjustifiedAbsences: number;
  justifiedLateness: number;
  unjustifiedLateness: number;
  disciplinaryRecords: number;
}

export interface FinancialSummary {
  totalFees: number;
  totalPaid: number;
  totalDiscount: number;
  totalDebit: number;
  outstandingBalance: number;
  lastPaymentDate: Date | null;
  status: {
    variant: BadgeVariant;
    text: string;
  };
}

export interface ContactSummary {
  primaryContact: ContactData["contact"] | null;
  secondaryContact: ContactData["contact"] | null;
  notificationPreference: string;
  contactsCount: number;
}

export interface DocumentSummary {
  uploadedCount: number;
  latestDocumentTitle: string | null;
  latestUploadDate: Date | null;
}

export interface TimelineSummary {
  lastGradeUpdate: Date | null;
  lastAttendanceEvent: Date | null;
  lastProfileActivity: Date | null;
  lastDocumentUpload: Date | null;
}

const numberFormatter = new Intl.NumberFormat();

export function formatCfaAmount(amount: number) {
  return `${numberFormatter.format(Math.round(amount))} CFA`;
}

export function formatStudentStatus(status: string | null | undefined) {
  const normalized = (status ?? "").toUpperCase();
  const map: Record<
    string,
    {
      text: string;
      variant: BadgeVariant;
    }
  > = {
    ACTIVE: { text: "Active", variant: "success" },
    GRADUATED: { text: "Graduated", variant: "neutral" },
    INACTIVE: { text: "Inactive", variant: "warning" },
    EXPELLED: { text: "Expelled", variant: "danger" },
  };

  return (
    map[normalized] ?? {
      text: startCase(normalized),
      variant: "neutral",
    }
  );
}

export function computeAcademicSummary(grades: GradeData[]): AcademicSummary {
  const graded = grades.filter(
    (grade) => !grade.isAbsent && grade.gradeSheet.scale > 0,
  );

  if (graded.length === 0) {
    return {
      gradeCount: 0,
      currentAverage: null,
      strongestSubject: null,
      weakestSubject: null,
      averageBadge: null,
    };
  }

  const subjectMap = new Map<
    string,
    { name: string; total: number; count: number }
  >();
  let total = 0;

  for (const grade of graded) {
    const normalized = normalizeGradePercentage(grade.grade, grade.gradeSheet.scale);
    total += normalized;

    const subjectId = `${grade.gradeSheet.subjectId}`;
    const subjectName =
      grade.gradeSheet.subject.course.shortName ||
      grade.gradeSheet.subject.course.reportName;

    const previous = subjectMap.get(subjectId);
    if (previous) {
      subjectMap.set(subjectId, {
        ...previous,
        total: previous.total + normalized,
        count: previous.count + 1,
      });
      continue;
    }

    subjectMap.set(subjectId, {
      name: subjectName,
      total: normalized,
      count: 1,
    });
  }

  const currentAverage = roundToOne(total / graded.length);
  const subjectAverages = Array.from(subjectMap.values()).map((subject) => ({
    name: subject.name,
    average: roundToOne(subject.total / subject.count),
  }));
  subjectAverages.sort((a, b) => b.average - a.average);

  return {
    gradeCount: graded.length,
    currentAverage,
    strongestSubject: subjectAverages[0] ?? null,
    weakestSubject: subjectAverages.at(-1) ?? null,
    averageBadge: getAverageBadge(currentAverage),
  };
}

export function computeAttendanceSummary(
  attendances: AttendanceData[],
): AttendanceSummary {
  return attendances.reduce(
    (acc, attendance) => {
      return {
        justifiedAbsences: acc.justifiedAbsences + attendance.justifiedAbsence,
        unjustifiedAbsences: acc.unjustifiedAbsences + attendance.absence,
        justifiedLateness: acc.justifiedLateness + attendance.justifiedLate,
        unjustifiedLateness: acc.unjustifiedLateness + attendance.late,
        disciplinaryRecords:
          acc.disciplinaryRecords +
          attendance.chatter +
          attendance.consigne +
          attendance.exclusion,
      };
    },
    {
      justifiedAbsences: 0,
      unjustifiedAbsences: 0,
      justifiedLateness: 0,
      unjustifiedLateness: 0,
      disciplinaryRecords: 0,
    },
  );
}

export function computeFinancialSummary(
  statements: StatementData[],
): FinancialSummary {
  const totals = statements.reduce(
    (acc, statement) => {
      if (statement.operation === "fee") {
        return {
          ...acc,
          fees: acc.fees + statement.amount,
        };
      }

      if (statement.type === "CREDIT") {
        const paymentDate = acc.lastPaymentDate;
        const currentDate = statement.transactionDate;

        return {
          ...acc,
          paid: acc.paid + statement.amount,
          lastPaymentDate:
            !paymentDate || paymentDate < currentDate
              ? currentDate
              : paymentDate,
        };
      }

      if (statement.type === "DEBIT") {
        return {
          ...acc,
          debit: acc.debit + statement.amount,
        };
      }

      if (statement.type === "DISCOUNT") {
        return {
          ...acc,
          discount: acc.discount + statement.amount,
        };
      }

      return acc;
    },
    {
      fees: 0,
      paid: 0,
      debit: 0,
      discount: 0,
      lastPaymentDate: null as Date | null,
    },
  );

  const outstandingBalance =
    totals.fees + totals.debit - totals.paid - totals.discount;
  const status =
    statements.length === 0
      ? { text: "No records", variant: "neutral" as const }
      : outstandingBalance <= 0
        ? { text: "Paid", variant: "success" as const }
        : { text: "Due", variant: "warning" as const };

  return {
    totalFees: totals.fees,
    totalPaid: totals.paid,
    totalDiscount: totals.discount,
    totalDebit: totals.debit,
    outstandingBalance,
    lastPaymentDate: totals.lastPaymentDate,
    status,
  };
}

export function computeContactSummary(contacts: ContactData[]): ContactSummary {
  const primary =
    contacts.find((contact) => contact.primaryContact)?.contact ??
    contacts[0]?.contact ??
    null;
  const secondary =
    contacts.find(
      (contact) =>
        contact.contactId !== primary?.id && !contact.primaryContact,
    )?.contact ?? null;

  const hasEmail = contacts.some(
    (contact) => !!contact.contact.user?.email || !!contact.contact.email,
  );
  const hasPhone = contacts.some(
    (contact) =>
      !!contact.contact.phoneNumber1 || !!contact.contact.phoneNumber2,
  );
  const notificationPreference = [
    hasEmail ? "Email" : null,
    hasPhone ? "SMS" : null,
  ]
    .filter(Boolean)
    .join(" + ");

  return {
    primaryContact: primary,
    secondaryContact: secondary,
    notificationPreference: notificationPreference || "Not set",
    contactsCount: contacts.length,
  };
}

export function computeDocumentSummary(documents: DocumentData[]): DocumentSummary {
  const latestDocument = documents[0];
  const latestDocumentTitle = latestDocument
    ? latestDocument.title ?? startCase(latestDocument.type)
    : null;

  return {
    uploadedCount: documents.length,
    latestDocumentTitle,
    latestUploadDate: latestDocument?.createdAt ?? null,
  };
}

export function computeTimelineSummary({
  grades,
  attendances,
  activities,
  documents,
}: {
  grades: GradeData[];
  attendances: AttendanceData[];
  activities: ActivityData[];
  documents: DocumentData[];
}): TimelineSummary {
  return {
    lastGradeUpdate: getLatestDate(grades.map((grade) => grade.gradeSheet.createdAt)),
    lastAttendanceEvent: getLatestDate(
      attendances.map((attendance) => attendance.createdAt),
    ),
    lastProfileActivity: getLatestDate(
      activities.map((activity) => activity.createdAt),
    ),
    lastDocumentUpload: getLatestDate(documents.map((document) => document.createdAt)),
  };
}

function getLatestDate(dates: Date[]) {
  if (dates.length === 0) {
    return null;
  }
  return dates.reduce((latest, current) => (current > latest ? current : latest));
}

function normalizeGradePercentage(grade: number, scale: number) {
  if (scale <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, (grade / scale) * 100));
}

function roundToOne(value: number) {
  return Math.round(value * 10) / 10;
}

function getAverageBadge(average: number) {
  if (average >= 80) {
    return { text: "Excellent", variant: "success" as const };
  }
  if (average >= 60) {
    return { text: "Good", variant: "success" as const };
  }
  if (average >= 50) {
    return { text: "Needs follow-up", variant: "warning" as const };
  }
  return { text: "At risk", variant: "danger" as const };
}

function startCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}
