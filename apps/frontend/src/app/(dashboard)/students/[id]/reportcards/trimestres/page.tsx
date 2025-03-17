import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";
import _, { sum } from "lodash";
import Link from "next/link";
import { Fragment } from "react";
import { EmptyState } from "~/components/EmptyState";
import type { FlatBadgeVariant } from "~/components/FlatBadge";
import FlatBadge from "~/components/FlatBadge";
import { ReportCardDiscipline } from "~/components/students/reportcards/ReportCardDiscipline";
import { ReportCardMention } from "~/components/students/reportcards/ReportCardMention";
import { ReportCardPerformance } from "~/components/students/reportcards/ReportCardPerformance";
import { ReportCardSummary } from "~/components/students/reportcards/ReportCardSummary";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { getAppreciations } from "~/utils/get-appreciation";
import { TrimestreHeader } from "./TrimestreHeader";
export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    trimestreId: string;
    classroomId: string;
    studentId: string;
    format: string;
  }>;
}) {
  const params = await props.params;

  const { t } = await getServerTranslations();
  const classroom = await api.student.classroom({ studentId: params.id });
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  const searchParams = await props.searchParams;
  const { trimestreId } = searchParams;
  const { title, seq1, seq2 } = getTitle({ trimestreId });

  const { studentsReport, summary, globalRanks } =
    await api.reportCard.getTrimestre({
      studentId: params.id,
      classroomId: classroom.id,
      trimestreId: trimestreId,
    });

  const subjects = await api.classroom.subjects(classroom.id);
  const groups = _.groupBy(subjects, "subjectGroupId");
  const studentReport = studentsReport.get(params.id);
  const globalRank = globalRanks.get(params.id);
  if (!studentReport || !globalRank) {
    return null;
  }

  const values = Array.from(globalRanks.values());
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const rowClassName = "border text-center py-0";
  return (
    <div className="flex flex-col gap-2">
      <TrimestreHeader
        trimestreId={trimestreId}
        studentId={params.id}
        title={title}
        classroomId={classroom.id}
      />
      <div className="px-4">
        <div className="bg-background overflow-hidden rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={cn(rowClassName, "text-left")}>
                  {t("subject")}
                </TableHead>
                <TableHead className={cn(rowClassName)}>{seq1}</TableHead>
                <TableHead className={cn(rowClassName)}>{seq2}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("Moy")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("coeff")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("total")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("rank")}</TableHead>
                <TableHead className={cn(rowClassName)}>{t("Moy.C")}</TableHead>
                <TableHead className={cn(rowClassName)}>
                  {t("Min/Max")}
                </TableHead>
                <TableHead className={cn(rowClassName)}>
                  {t("appreciation")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(groups).map((groupId: string) => {
                const items = groups[Number(groupId)]?.sort(
                  (a, b) => a.order - b.order,
                );

                if (!items) return null;
                const group = items[0];
                return (
                  <Fragment key={`fragment-${groupId}`}>
                    {items.map((subject, index) => {
                      const grade = studentReport.studentCourses.find(
                        (c) => c.subjectId === subject.id,
                      );
                      const subjectSummary = summary.get(subject.id);
                      return (
                        <TableRow key={`${subject.id}-${groupId}-${index}`}>
                          <TableCell className={cn(rowClassName, "text-left")}>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {subject.course.reportName}
                              </span>
                              <Link
                                href={`/staffs/${subject.teacher?.id}`}
                                className="ml-4 hover:text-blue-500 hover:underline"
                              >
                                {subject.teacher?.prefix}{" "}
                                {subject.teacher?.lastName}
                              </Link>
                            </div>
                            {/* {subject.course.reportName} */}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            <Cell n={grade?.grade1} />
                          </TableCell>
                          <TableCell className={rowClassName}>
                            <Cell n={grade?.grade2} />
                          </TableCell>
                          <TableCell className={rowClassName}>
                            <Cell n={grade?.average} />
                          </TableCell>
                          <TableCell
                            className={cn("text-center", rowClassName)}
                          >
                            {grade?.coeff}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {grade?.total?.toFixed(2)}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {grade?.rank}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {subjectSummary?.average.toFixed(2)}
                          </TableCell>
                          <TableCell className={rowClassName}>
                            {subjectSummary?.min.toFixed(2)} /{" "}
                            {subjectSummary?.max.toFixed(2)}
                          </TableCell>
                          <TableCell className={cn("uppercase", rowClassName)}>
                            {getAppreciations(subjectSummary?.average)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow
                      className="bg-secondary border text-secondary-foreground"
                      key={`recap-${groupId}`}
                    >
                      <TableCell
                        className={cn(rowClassName, "text-left")}
                        colSpan={4}
                      >
                        {group?.subjectGroup?.name}
                      </TableCell>
                      <TableCell className={cn(rowClassName)}>
                        {sum(items.map((c) => c.coefficient))}
                      </TableCell>
                      <TableCell className={cn(rowClassName)} colSpan={3}>
                        {t("points")} :{" "}
                        {sum(
                          items.map(
                            (subject) =>
                              (studentReport.studentCourses.find(
                                (c) => subject.id === c.subjectId,
                              )?.average ?? 0) * subject.coefficient,
                          ),
                        ).toFixed(1)}{" "}
                        / {sum(items.map((c) => 20 * c.coefficient)).toFixed(1)}
                      </TableCell>
                      <TableCell
                        className={cn(rowClassName, "py-2")}
                        colSpan={2}
                      >
                        {t("average")} :{" "}
                        {(
                          sum(
                            items.map(
                              (subject) =>
                                (studentReport.studentCourses.find(
                                  (c) => c.subjectId === subject.id,
                                )?.average ?? 0) * subject.coefficient,
                            ),
                          ) / sum(items.map((subject) => subject.coefficient))
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-row items-start gap-2 p-2">
          <ReportCardMention id={params.id} />
          <ReportCardDiscipline id={params.id} />
          <ReportCardPerformance
            successRate={successRate}
            max={Math.max(...averages)}
            min={Math.min(...averages)}
            avg={averages.reduce((acc, val) => acc + val, 0) / averages.length}
          />
          <ReportCardSummary
            id={params.id}
            rank={globalRank.rank}
            average={globalRank.average}
          />
        </div>
      </div>
    </div>
  );
}

function getTitle({ trimestreId }: { trimestreId: string }) {
  if (trimestreId == "trim1") {
    return {
      title: "BULLETIN SCOLAIRE DU PREMIER TRIMESTRE",
      seq1: "SEQ1",
      seq2: "SEQ2",
    };
  }
  if (trimestreId == "trim2") {
    return {
      title: "BULLETIN SCOLAIRE DU SECOND TRIMESTRE",
      seq1: "SEQ3",
      seq2: "SEQ4",
    };
  }
  return {
    title: "BULLETIN SCOLAIRE DU TROISIEME TRIMESTRE",
    seq1: "SEQ5",
    seq2: "SEQ6",
  };
}

function Cell({ n }: { n?: number | null }) {
  let v: FlatBadgeVariant = "green";

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (n == undefined || n == null) {
    return <></>;
  }
  if (n < 10) {
    v = "red";
  } else if (n < 12) {
    v = "yellow";
  } else if (n < 14) {
    v = "blue";
  }
  return (
    <FlatBadge
      className="w-[50px] justify-center text-center text-xs font-normal"
      variant={v}
    >
      {n.toFixed(2)}
    </FlatBadge>
  );
}
