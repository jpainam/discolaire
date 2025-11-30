import type { SearchParams } from "nuqs/server";
import { Fragment, Suspense } from "react";
import Link from "next/link";
import _, { sum } from "lodash";
import { CircleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";

import type { FlatBadgeVariant } from "~/components/FlatBadge";
import { ReportCardActionHeader } from "~/components/classrooms/reportcards/ReportCardActionHeader";
import { EmptyComponent } from "~/components/EmptyComponent";
import FlatBadge from "~/components/FlatBadge";
import { ReportCardDiscipline } from "~/components/students/reportcards/ReportCardDiscipline";
import { ReportCardMention } from "~/components/students/reportcards/ReportCardMention";
import { ReportCardPerformance } from "~/components/students/reportcards/ReportCardPerformance";
import { ReportCardSummary } from "~/components/students/reportcards/ReportCardSummary";
import { caller, getQueryClient, trpc } from "~/trpc/server";
import { getAppreciations } from "~/utils/appreciations";
import { reportcardSearchParams } from "~/utils/search-params";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const t = await getTranslations();
  const { id } = params;
  const queryClient = getQueryClient();
  const student = await caller.student.get(id);
  if (!student.classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }

  const { termId } = await reportcardSearchParams(props.searchParams);

  if (!termId) {
    return <EmptyComponent title={t("select_terms")} />;
  }
  const { studentsReport, summary, globalRanks } =
    await caller.reportCard.getSequence({
      classroomId: student.classroom.id,
      termId: termId,
    });

  const disciplines = await caller.discipline.sequence({
    classroomId: student.classroom.id,
    termId: termId,
  });
  const disc = disciplines.get(params.id);
  const classroom = await queryClient.fetchQuery(
    trpc.classroom.get.queryOptions(student.classroom.id),
  );
  const term = await queryClient.fetchQuery(trpc.term.get.queryOptions(termId));

  const subjects = await caller.classroom.subjects(student.classroom.id);
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
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const rowClassName = "border text-center py-0";

  return (
    <div className="mb-10 flex w-full flex-col gap-2">
      <ReportCardActionHeader
        title={`BULLETIN SCOLAIRE : ${term.name}`}
        maxAvg={Math.max(...averages)}
        minAvg={Math.min(...averages)}
        avg={average}
        successRate={successRate}
        classroomSize={classroom.size}
        pdfHref={`/api/pdfs/reportcards/ipbw/?studentId=${params.id}&termId=${termId}`}
      />

      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <CheckSubjectScale termId={termId} classroomId={classroom.id} />
      </Suspense>
      <div className="overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[15px]"></TableHead>
              <TableHead className={cn(rowClassName)}>
                {t("subjects")}
              </TableHead>
              <TableHead className={cn(rowClassName)}>{t("grades")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("coeff")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("total")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("rank")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("AvgC")}</TableHead>
              <TableHead className={cn(rowClassName)}>{t("min_max")}</TableHead>
              <TableHead>{t("appreciation")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(groups).map((groupId: string) => {
              const items = groups[Number(groupId)]?.sort(
                (a, b) => a.order - b.order,
              );

              if (!items) return null;
              const group = items[0]?.subjectGroup;
              let coeff = 0;
              return (
                <Fragment key={`fragment-${groupId}`}>
                  {items.map((subject, index) => {
                    const grade = studentReport.studentCourses.find(
                      (c) => c.subjectId === subject.id,
                    );
                    const subjectSummary = summary.get(subject.id);
                    coeff += grade?.grade != null ? subject.coefficient : 0;
                    return (
                      <TableRow key={`${subject.id}-${groupId}-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className={cn(rowClassName, "text-left")}>
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {subject.course.reportName}
                            </span>
                            <Link
                              href={`/staffs/${subject.teacherId}`}
                              className="ml-4 hover:text-blue-500 hover:underline"
                            >
                              {subject.teacher?.prefix}{" "}
                              {subject.teacher?.lastName}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          <Cell n={grade?.grade} />
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {grade?.grade != null && subject.coefficient}
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {grade?.total?.toFixed(2)}
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {grade?.rank}
                        </TableCell>
                        <TableCell className={cn(rowClassName)}>
                          {subjectSummary?.average.toFixed(2)}
                        </TableCell>
                        {grade?.grade && (
                          <TableCell className={cn(rowClassName)}>
                            {subjectSummary?.min.toFixed(2)} /{" "}
                            {subjectSummary?.max.toFixed(2)}
                          </TableCell>
                        )}
                        <TableCell
                          className={cn("border-y text-left uppercase")}
                        >
                          {getAppreciations(grade?.grade)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow
                    className="bg-secondary text-secondary-foreground"
                    key={`recap-${groupId}`}
                  >
                    <TableCell></TableCell>
                    <TableCell className="" colSpan={2}>
                      {group?.name}
                    </TableCell>
                    <TableCell className={cn(rowClassName)}>{coeff}</TableCell>
                    <TableCell className="text-center text-sm" colSpan={3}>
                      {t("points")}:{" "}
                      {sum(
                        items.map(
                          (subject) =>
                            studentReport.studentCourses.find(
                              (c) => c.subjectId === subject.id,
                            )?.total ?? 0,
                        ),
                      ).toFixed(1)}{" "}
                      /{" "}
                      {sum(
                        items.map((subject) => 20 * subject.coefficient),
                      ).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-sm" colSpan={2}>
                      {t("average")} :{" "}
                      {(
                        sum(
                          items.map(
                            (subject) =>
                              studentReport.studentCourses.find(
                                (c) => c.subjectId === subject.id,
                              )?.total,
                          ),
                        ) / (coeff || 1)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-start gap-2 py-2">
        <ReportCardMention average={globalRank.average} id={params.id} />
        <ReportCardDiscipline
          absence={disc?.absence ?? 0}
          lateness={disc?.late ?? 0}
          justifiedLateness={disc?.justifiedLate ?? 0}
          consigne={disc?.consigne ?? 0}
          justifiedAbsence={disc?.justifiedAbsence ?? 0}
          id={params.id}
        />
        <ReportCardPerformance
          successRate={successRate}
          max={Math.max(...averages)}
          min={Math.min(...averages)}
          avg={average}
        />
        <ReportCardSummary
          id={params.id}
          rank={globalRank.rank}
          average={globalRank.average}
        />
      </div>
    </div>
  );
}

// <ReportCardSummary />;

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

async function CheckSubjectScale({
  termId,
  classroomId,
}: {
  termId: string;
  classroomId: string;
}) {
  const queryClient = getQueryClient();
  const allweights = await queryClient.fetchQuery(
    trpc.gradeSheet.subjectWeight.queryOptions({
      classroomId,
      termId: [termId],
    }),
  );
  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const areNot100percent = allweights.filter((s) => !s.weight || s.weight < 1);
  if (areNot100percent.length == 0) {
    return <></>;
  }
  return (
    <div className="px-4">
      <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
        <p className="text-sm">
          <CircleAlert
            className="me-3 -mt-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
          Les cours suivants n'ont pas un poids de 100%:
          {areNot100percent.map((a, index) => {
            const subject = subjects.find((s) => s.id == a.subjectId);
            return (
              <span className="px-2" key={index}>
                {subject?.course.shortName}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
