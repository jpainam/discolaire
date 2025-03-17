import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import _, { sum } from "lodash";
import { Fragment } from "react";
import { EmptyState } from "~/components/EmptyState";
import type { FlatBadgeVariant } from "~/components/FlatBadge";
import FlatBadge from "~/components/FlatBadge";
import { ReportCardDiscipline } from "~/components/students/report-cards/ReportCardDiscipline";
import { ReportCardMention } from "~/components/students/report-cards/ReportCardMention";
import { ReportCardPerformance } from "~/components/students/report-cards/ReportCardPerformance";
import { ReportCardSummary } from "~/components/students/report-cards/ReportCardSummary";
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

  return (
    <div className="flex flex-col gap-4">
      <TrimestreHeader
        trimestreId={trimestreId}
        studentId={params.id}
        title={title}
        classroomId={classroom.id}
      />
      <div className="px-4">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("subject")}</TableHead>
                <TableHead>{seq1}</TableHead>
                <TableHead>{seq2}</TableHead>
                <TableHead>{t("Moy")}</TableHead>
                <TableHead className="text-center">{t("coeff")}</TableHead>
                <TableHead>{t("total")}</TableHead>
                <TableHead>{t("rank")}</TableHead>
                <TableHead>{t("Moy.C")}</TableHead>
                <TableHead>{t("Min/Max")}</TableHead>
                <TableHead>{t("appreciation")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(groups).map((groupId: string) => {
                const items = groups[Number(groupId)]?.sort(
                  (a, b) => a.order - b.order
                );

                if (!items) return null;
                const group = items[0];
                return (
                  <Fragment key={`fragment-${groupId}`}>
                    {items.map((subject, index) => {
                      const grade = studentReport.studentCourses.find(
                        (c) => c.subjectId === subject.id
                      );
                      const subjectSummary = summary.get(subject.id);
                      return (
                        <TableRow key={`${subject.id}-${groupId}-${index}`}>
                          <TableCell>{subject.course.reportName}</TableCell>
                          <TableCell>
                            <Cell n={grade?.grade1} />
                          </TableCell>
                          <TableCell>
                            <Cell n={grade?.grade2} />
                          </TableCell>
                          <TableCell>
                            <Cell n={grade?.average} />
                          </TableCell>
                          <TableCell className="text-center">
                            {grade?.coeff}
                          </TableCell>
                          <TableCell>{grade?.total}</TableCell>
                          <TableCell>{grade?.rank}</TableCell>
                          <TableCell>
                            {subjectSummary?.average.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {subjectSummary?.min} / {subjectSummary?.max}
                          </TableCell>
                          <TableCell className="uppercase">
                            {getAppreciations(subjectSummary?.average)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow
                      className="bg-secondary text-secondary-foreground"
                      key={`recap-${groupId}`}
                    >
                      <TableCell className="" colSpan={4}>
                        {group?.subjectGroup?.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {sum(items.map((c) => c.coefficient))}
                      </TableCell>
                      <TableCell className="text-center text-sm" colSpan={3}>
                        {t("points")}:{" "}
                        {sum(
                          items.map(
                            (subject) =>
                              (studentReport.studentCourses.find(
                                (c) => subject.id === c.subjectId
                              )?.average ?? 0) * subject.coefficient
                          )
                        ).toFixed(1)}{" "}
                        / {sum(items.map((c) => 20 * c.coefficient)).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-sm" colSpan={2}>
                        {t("average")} :
                        {(
                          sum(
                            items.map(
                              (subject) =>
                                (studentReport.studentCourses.find(
                                  (c) => c.subjectId === subject.id
                                )?.average ?? 0) * subject.coefficient
                            )
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
