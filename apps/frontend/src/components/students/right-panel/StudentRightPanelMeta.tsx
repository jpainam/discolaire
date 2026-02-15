"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { EmptyComponent } from "~/components/EmptyComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";
import { StudentPerformanceTrend } from "./StudentPerformanceTrend";
import {
  computeAcademicSummary,
  computeAttendanceSummary,
  computeContactSummary,
  computeDocumentSummary,
  computeFinancialSummary,
  computeTimelineSummary,
  formatStudentStatus,
} from "./StudentRightPanelMeta.utils";
import {
  StudentAcademicSection,
  StudentAttendanceSection,
  StudentDocumentsSection,
  StudentFinancialSection,
  StudentIdentitySection,
  StudentParentsSection,
  StudentQuickActionsSection,
  StudentTimelineSection,
} from "./StudentRightPanelMetaSections";

export function StudentRightPanelMeta({ studentId }: { studentId: string }) {
  const trpc = useTRPC();

  const studentQuery = useQuery(trpc.student.get.queryOptions(studentId));
  const gradesQuery = useQuery(
    trpc.student.grades.queryOptions({ id: studentId }),
  );
  const attendanceQuery = useQuery(
    trpc.attendance.student.queryOptions({ studentId }),
  );
  const statementsQuery = useQuery(
    trpc.student.getStatements.queryOptions(studentId),
  );
  const contactsQuery = useQuery(trpc.student.contacts.queryOptions(studentId));
  const documentsQuery = useQuery(
    trpc.student.documents.queryOptions(studentId),
  );
  const activitiesQuery = useQuery(
    trpc.student.activities.queryOptions({ studentId, limit: 20 }),
  );

  const academicSummary = useMemo(
    () => computeAcademicSummary(gradesQuery.data ?? []),
    [gradesQuery.data],
  );
  const attendanceSummary = useMemo(
    () => computeAttendanceSummary(attendanceQuery.data ?? []),
    [attendanceQuery.data],
  );
  const financialSummary = useMemo(
    () => computeFinancialSummary(statementsQuery.data ?? []),
    [statementsQuery.data],
  );
  const contactsSummary = useMemo(
    () => computeContactSummary(contactsQuery.data ?? []),
    [contactsQuery.data],
  );
  const documentsSummary = useMemo(
    () => computeDocumentSummary(documentsQuery.data ?? []),
    [documentsQuery.data],
  );
  const timelineSummary = useMemo(
    () =>
      computeTimelineSummary({
        grades: gradesQuery.data ?? [],
        attendances: attendanceQuery.data ?? [],
        activities: activitiesQuery.data ?? [],
        documents: documentsQuery.data ?? [],
      }),
    [
      gradesQuery.data,
      attendanceQuery.data,
      activitiesQuery.data,
      documentsQuery.data,
    ],
  );

  if (studentQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-20" key={index} />
        ))}
      </div>
    );
  }

  const student = studentQuery.data;
  if (!student) {
    return <EmptyComponent />;
  }

  return (
    <Accordion
      type="multiple"
      defaultValue={[
        "identity",
        "academic",
        "attendance",
        "financial",
        "parents",
        "documents",
        "timeline",
        "actions",
        "trend",
      ]}
      className="w-full rounded-none border-none"
    >
      <AccordionItem value="identity">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Identity
        </AccordionTrigger>
        <AccordionContent>
          <StudentIdentitySection
            student={student}
            statusBadge={formatStudentStatus(student.status)}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="trend">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Performance Trend
        </AccordionTrigger>
        <AccordionContent>
          <StudentPerformanceTrend studentId={studentId} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="academic">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Academic Summary
        </AccordionTrigger>
        <AccordionContent>
          <StudentAcademicSection summary={academicSummary} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="attendance">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Attendance & Behavior
        </AccordionTrigger>
        <AccordionContent>
          <StudentAttendanceSection summary={attendanceSummary} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="financial">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Financial Status
        </AccordionTrigger>
        <AccordionContent>
          <StudentFinancialSection summary={financialSummary} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="parents">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Parents / Guardians
        </AccordionTrigger>
        <AccordionContent>
          <StudentParentsSection summary={contactsSummary} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="documents">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Documents
        </AccordionTrigger>
        <AccordionContent>
          <StudentDocumentsSection summary={documentsSummary} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="timeline">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Recent Timeline
        </AccordionTrigger>
        <AccordionContent>
          <StudentTimelineSection summary={timelineSummary} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="actions">
        <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
          Quick Actions
        </AccordionTrigger>
        <AccordionContent>
          <StudentQuickActionsSection studentId={studentId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
