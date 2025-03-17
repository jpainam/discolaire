import { EmptyState } from "~/components/EmptyState";

import { ReportCardStudentTable } from "./ReportCardStudentTable";

interface ReportCardProps {
  searchParams: {
    classroom?: string;
    student?: string;
    term?: string;
  };
}
export function ReportCard({ searchParams }: ReportCardProps) {
  if (!searchParams.classroom) {
    return <EmptyState className="my-8" />;
  }
  if (!searchParams.term) {
    return <EmptyState className="my-8" />;
  }

  // const reportCard = await api.reportCard.getSummary({
  //   classroomId: searchParams.classroom,
  //   termId: Number(searchParams.term),
  // });
  // if (!searchParams.student) {
  //   return (
  //     <ReportCardTable
  //       reportCard={reportCard.map((report) => {
  //         console.log(report);
  //         return {
  //           min: 0,
  //           max: 0,
  //           avg: 0,
  //           subject: {
  //             teacher: "Dupont",
  //             teacherId: "teacher_id",
  //             name: "Maths",
  //           },
  //         };
  //       })}
  //     />
  //   );
  // }
  return <ReportCardStudentTable />;
}
