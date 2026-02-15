"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Edit,
  FileText,
  MessageSquare,
  PlusCircle,
  UserRound,
} from "lucide-react";

import type {
  AcademicSummary,
  AttendanceSummary,
  BadgeVariant,
  ContactSummary,
  DocumentSummary,
  FinancialSummary,
  StudentData,
  TimelineSummary,
} from "./StudentRightPanelMeta.utils";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { getFullName } from "~/utils";
import { formatCfaAmount } from "./StudentRightPanelMeta.utils";

interface MetaFieldProps {
  label: string;
  value?: string | number | null | undefined;
  badge?: {
    variant: BadgeVariant;
    text: string;
  };
}

export function MetaField({ label, value, badge }: MetaFieldProps) {
  const badgeColors = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
    neutral: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        {value && (
          <Label className="text-foreground text-right font-medium">
            {formatValue(value)}
          </Label>
        )}
        {badge ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              badgeColors[badge.variant],
            )}
          >
            {badge.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function StudentIdentitySection({
  student,
  statusBadge,
}: {
  student: StudentData;
  statusBadge: {
    text: string;
    variant: BadgeVariant;
  };
}) {
  //const fullName = getFullName(student).trim();
  //const initials = getInitials(fullName) || "ST";

  return (
    <div className="space-y-3 pt-2">
      {/* <div className="mb-4 flex items-center gap-3">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-foreground font-semibold">
            {fullName || "Unknown"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {student.registrationNumber ?? "No registration number"}
          </p>
        </div>
      </div> */}
      <MetaField label="Classe" value={student.classroom?.name} />
      <MetaField label="Niveau" value={student.classroom?.reportName} />
      <MetaField label="Statut" value={statusBadge.text} badge={statusBadge} />
    </div>
  );
}

export function StudentAcademicSection({
  summary,
}: {
  summary: AcademicSummary;
}) {
  return (
    <div className="space-y-3 pt-2">
      <MetaField
        label="Current Average"
        value={
          summary.currentAverage === null
            ? null
            : `${summary.currentAverage.toFixed(1)}%`
        }
        badge={summary.averageBadge ?? undefined}
      />
      <MetaField
        label="Notes reçues"
        value={`${summary.gradeCount} / ${summary.totalCount}`}
      />
      <MetaField
        label="Forte Matière"
        value={
          summary.strongestSubject
            ? `${summary.strongestSubject.name} (${summary.strongestSubject.average.toFixed(1)}%)`
            : null
        }
      />
      <MetaField
        label="Faible Matière"
        value={
          summary.weakestSubject
            ? `${summary.weakestSubject.name} (${summary.weakestSubject.average.toFixed(1)}%)`
            : null
        }
      />
    </div>
  );
}

export function StudentAttendanceSection({
  summary,
}: {
  summary: AttendanceSummary;
}) {
  return (
    <div className="space-y-2">
      <MetaField label="Abs. Just" value={summary.justifiedAbsences} />
      <MetaField
        label="Abs. Injust"
        badge={
          summary.unjustifiedAbsences > 0
            ? {
                variant: "danger",
                text: summary.unjustifiedAbsences.toString(),
              }
            : { variant: "neutral", text: "None" }
        }
        //value={summary.unjustifiedAbsences}
      />
      <MetaField label="Retard just" value={summary.justifiedLateness} />
      <MetaField label="Retard Injust" value={summary.unjustifiedLateness} />
      <MetaField
        label="Disciplinary Records"
        value={
          summary.disciplinaryRecords == 0 ? null : summary.disciplinaryRecords
        }
        badge={
          summary.disciplinaryRecords === 0
            ? { text: "None", variant: "success" }
            : { text: "Review", variant: "warning" }
        }
      />
    </div>
  );
}

export function StudentFinancialSection({
  summary,
}: {
  summary: FinancialSummary;
}) {
  return (
    <div className="space-y-3 pt-2">
      <MetaField
        label="Fees Status"
        value={summary.status.text}
        badge={summary.status}
      />
      <MetaField
        label="Outstanding Balance"
        value={formatCfaAmount(summary.outstandingBalance)}
      />
      <MetaField
        label="Total Fees"
        value={formatCfaAmount(summary.totalFees)}
      />
      <MetaField
        label="Last Payment"
        value={formatRelativeDate(summary.lastPaymentDate)}
      />
    </div>
  );
}

export function StudentParentsSection({
  summary,
}: {
  summary: ContactSummary;
}) {
  return (
    <div className="space-y-3 pt-2">
      <MetaField
        label="Primary Contact"
        value={
          summary.primaryContact
            ? getFullName(summary.primaryContact).trim()
            : null
        }
      />
      <MetaField
        label="Secondary Contact"
        value={
          summary.secondaryContact
            ? getFullName(summary.secondaryContact).trim()
            : null
        }
      />
      <MetaField
        label="Notification Preference"
        value={summary.notificationPreference}
      />
      <MetaField label="Contacts Count" value={summary.contactsCount} />
    </div>
  );
}

export function StudentDocumentsSection({
  summary,
}: {
  summary: DocumentSummary;
}) {
  return (
    <div className="space-y-3 pt-2">
      <MetaField label="Uploaded Documents" value={summary.uploadedCount} />
      <MetaField label="Latest Document" value={summary.latestDocumentTitle} />
      <MetaField
        label="Last Upload"
        value={formatRelativeDate(summary.latestUploadDate)}
      />
    </div>
  );
}

export function StudentTimelineSection({
  summary,
}: {
  summary: TimelineSummary;
}) {
  return (
    <div className="space-y-2 pt-2 text-sm">
      <TimelineItem label="Last grade update" value={summary.lastGradeUpdate} />
      <TimelineItem
        label="Last attendance event"
        value={summary.lastAttendanceEvent}
      />
      <TimelineItem
        label="Last profile activity"
        value={summary.lastProfileActivity}
      />
      <TimelineItem
        label="Last document upload"
        value={summary.lastDocumentUpload}
      />
    </div>
  );
}

export function StudentQuickActionsSection({
  studentId,
}: {
  studentId: string;
}) {
  const router = useRouter();
  return (
    <div className="grid gap-2 pt-2">
      <Button
        onClick={() => {
          router.push(routes.students.grades(studentId));
        }}
        variant="link"
        className="w-full justify-start"
        size="sm"
      >
        <PlusCircle />
        View Grades
      </Button>
      <Button
        onClick={() => {
          router.push(routes.students.attendances.index(studentId));
        }}
        variant="link"
        className="w-full justify-start"
        size="sm"
      >
        <UserRound />
        View Attendance
      </Button>
      <Button
        onClick={() => {
          router.push(routes.students.notifications(studentId));
        }}
        variant="link"
        className="w-full justify-start"
        size="sm"
      >
        <MessageSquare />
        Notifications
      </Button>
      <Button
        onClick={() => {
          router.push(`/students/${studentId}/documents`);
        }}
        variant="link"
        className="w-full justify-start"
        size="sm"
      >
        <FileText />
        Documents
      </Button>
      <Button
        onClick={() => {
          router.push(routes.students.edit(studentId));
        }}
        variant="link"
        className="w-full justify-start"
        size="sm"
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
    </div>
  );
}

function TimelineItem({ label, value }: { label: string; value: Date | null }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <Clock className="text-muted-foreground mt-0.5 h-3 w-3" />
      <div className="flex flex-col gap-1">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {formatRelativeDate(value)}
        </span>
      </div>
    </div>
  );
}

function formatRelativeDate(value: Date | null) {
  if (!value) {
    return "No data";
  }
  return formatDistanceToNow(value, { addSuffix: true });
}

function formatValue(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return `${value}`;
  }
  if (!value || value.trim().length === 0) {
    return "N/A";
  }
  return value;
}
