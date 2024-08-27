import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

import { reportCardService } from "~/server/services/report-card-service";
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
  const { t } = await getServerTranslations();
  if (!searchParams.classroom) {
    return <EmptyState className="my-8" />;
  }
  if (!searchParams.term) {
    return <EmptyState className="my-8" />;
  }

  const reportCard = await reportCardService.getClassroomSummary(
    searchParams.classroom,
    Number(searchParams.term),
  );
  if (!searchParams.student) {
    return (
      <>
        {reportCard && (
          <ReportCardTable
            reportCard={reportCard.map((report) => {
              return {
                min: report.minClassroomGrade,
                max: report.maxClassroomGrade,
                avg: report.avgClassroomGrade,
                subject: {
                  teacher: report.subject.teacher?.lastName || "",
                  teacherId: report.subject.teacherId || "",
                  name: report?.subject.course?.name || "",
                },
              };
            })}
          />
        )}
      </>
    );
  }
  return <ReportCardStudentTable />;
}
