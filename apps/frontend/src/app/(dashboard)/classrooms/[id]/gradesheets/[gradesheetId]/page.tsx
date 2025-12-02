import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Award, BookOpen, Calendar, TrendingUp, Users } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { Skeleton } from "@repo/ui/components/skeleton";

import { ClassroomGradeChart } from "~/components/classrooms/gradesheets/ClassroomGradeChart";
import { ClassroomGradeList } from "~/components/classrooms/gradesheets/ClassroomGradeList";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, getQueryClient, trpc } from "~/trpc/server";
import { getAppreciations } from "~/utils/appreciations";

export default async function Page(props: {
  params: Promise<{ gradesheetId: number; id: string }>;
}) {
  const params = await props.params;

  const { gradesheetId } = params;
  const queryClient = getQueryClient();

  batchPrefetch([trpc.classroom.students.queryOptions(params.id)]);

  const gradesheet = await queryClient.fetchQuery(
    trpc.gradeSheet.get.queryOptions(Number(gradesheetId)),
  );

  const grades = await queryClient.fetchQuery(
    trpc.gradeSheet.grades.queryOptions(Number(gradesheetId)),
  );

  const t = await getTranslations();
  const locale = await getLocale();
  const maxGrade = Math.max(...grades.map((grade) => grade.grade));
  const minGrade = Math.min(
    ...grades.filter((g) => !g.isAbsent).map((grade) => grade.grade),
  );
  const grades10 = grades.filter((grade) => grade.grade >= 10).length;
  const len = grades.filter((grade) => !grade.isAbsent).length;
  const average =
    len == 0 ? 0 : grades.reduce((acc, grade) => acc + grade.grade, 0) / len;
  const maleCount = grades.filter(
    (grade) => !grade.isAbsent && grade.student.gender == "male",
  ).length;
  const males10Rate =
    maleCount == 0
      ? 0
      : grades.filter(
          (grade) => grade.grade >= 10 && grade.student.gender == "male",
        ).length / maleCount;

  const femaleCount = grades.filter(
    (grade) => !grade.isAbsent && grade.student.gender == "female",
  ).length;
  const females10Rate =
    femaleCount == 0
      ? 0
      : grades.filter(
          (grade) => grade.grade >= 10 && grade.student.gender == "female",
        ).length / femaleCount;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isClosed = !gradesheet.term.isActive;

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <Card className="">
        <CardContent className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-2 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div className="font-medium">
                {gradesheet.subject.course.name}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("coeff")} : {gradesheet.subject.coefficient}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("Devoir")} : {gradesheet.name}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("teacher")} : {gradesheet.subject.teacher?.lastName}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div className="font-medium">Informations</div>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("date")} :{" "}
              {gradesheet.createdAt.toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                weekday: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("scale")}: {gradesheet.scale}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("term")} : {gradesheet.term.name}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="font-medium">Notes</div>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("max_grade")} : {isFinite(maxGrade) ? maxGrade : "-"}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("min_grade")} : {isFinite(minGrade) ? minGrade : "-"}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("average")} : {average.toFixed(2)}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-600" />
              <div className="font-medium">{t("appreciation")}</div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {getAppreciations(average, gradesheet.scale)}
            </Badge>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="px-0 py-2">
          <CardContent>
            <div className="text-sm font-medium">{t("evaluated_students")}</div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">
                {len} / {grades.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="px-0 py-2">
          <CardContent>
            <div className="text-sm font-medium">{t("overall_average")}</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{average.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="px-0 py-2">
          <CardContent>
            <div className="text-sm font-medium">{t("average")} ≥ 10</div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{grades10}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="px-0 py-2">
          <CardContent>
            <div className="text-sm font-medium">{t("success_rate")}</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("males")} ({maleCount}):
                </span>
                <span className="font-medium">
                  {(males10Rate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("females")} ({femaleCount}):
                </span>
                <span className="font-medium">
                  {(females10Rate * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="px-0 py-2">
          <CardContent>
            <div className="text-sm font-medium">{t("success_rate")} ≥ 10</div>
            <div className="flex items-center space-x-2">
              <Progress value={(grades10 * 100) / len} />
              <span className="text-sm font-medium">
                {len == 0 ? 0 : ((grades10 * 100) / len).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <GradeDetailsHeader gradesheet={gradesheet} grades={allGrades} /> */}
      {/* {isClosed && (
        <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
          <p className="text-sm">
            <TriangleAlert
              className="me-3 -mt-0.5 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("this_term_is_closed")}
          </p>
        </div>
      )} */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-2 p-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton className="h-8" key={index} />
                ))}
              </div>
            }
          >
            <ClassroomGradeList
              className="col-span-3"
              gradesheet={gradesheet}
              grades={grades}
            />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary errorComponent={ErrorFallback}>
          <ClassroomGradeChart grades={grades} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
