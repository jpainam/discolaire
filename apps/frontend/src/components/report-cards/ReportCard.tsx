import { EmptyState } from "@repo/ui/EmptyState";

import { api } from "~/trpc/server";
import { ReportCardStudentTable } from "./ReportCardStudentTable";
import { ReportCardTable } from "./ReportCardTable";

interface ReportCardProps {
  searchParams: {
    classroom?: string;
    student?: string;
    term?: string;
  };
}
export async function ReportCard({ searchParams }: ReportCardProps) {
  if (!searchParams.classroom) {
    return <EmptyState className="my-8" />;
  }
  if (!searchParams.term) {
    return <EmptyState className="my-8" />;
  }

  const reportCard = await api.reportCard.getSummary({
    classroomId: searchParams.classroom,
    termId: Number(searchParams.term),
  });
  if (!searchParams.student) {
    return (
      <ReportCardTable
        reportCard={reportCard.map((report) => {
          return {
            min: report.minClassroomGrade,
            max: report.maxClassroomGrade,
            avg: report.avgClassroomGrade,
            subject: {
              teacher: report.subject.teacher?.lastName ?? "",
              teacherId: report.subject.teacherId ?? "",
              name: report.subject.course?.name ?? "",
            },
          };
        })}
      />
    );
  }
  return <ReportCardStudentTable />;
}
