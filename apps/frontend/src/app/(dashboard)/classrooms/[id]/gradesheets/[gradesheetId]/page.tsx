import { Badge } from "@repo/ui/components/badge";
import { Card, CardContent } from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import i18next from "i18next";
import {
  Award,
  BookOpen,
  Calendar,
  TrendingUp,
  TriangleAlert,
  Users,
} from "lucide-react";
import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getAppreciations } from "~/utils/appreciations";
import { ClassroomGradeChart } from "./ClassroomGradeChart";
import { ClassroomGradeList } from "./ClassroomGradeList";

export default async function Page(props: {
  params: Promise<{ gradesheetId: number }>;
}) {
  const params = await props.params;

  const { gradesheetId } = params;
  const session = await getSession();
  const gradesheet = await caller.gradeSheet.get(Number(gradesheetId));

  let grades = await caller.gradeSheet.grades(Number(gradesheetId));

  if (session?.user.profile === "student") {
    const student = await caller.student.getFromUserId(session.user.id);
    grades = grades.filter((g) => g.studentId === student.id);
  } else if (session?.user.profile === "contact") {
    const contact = await caller.contact.getFromUserId(session.user.id);
    const students = await caller.contact.students(contact.id);
    const studentIds = students.map((s) => s.studentId);
    grades = grades.filter((g) => studentIds.includes(g.studentId));
  }

  const { t } = await getServerTranslations();
  const maxGrade = Math.max(...grades.map((grade) => grade.grade));
  const minGrade = Math.min(
    ...grades.filter((g) => !g.isAbsent).map((grade) => grade.grade)
  );
  const grades10 = grades.filter((grade) => grade.grade >= 10).length;
  const len = grades.filter((grade) => !grade.isAbsent).length || 1e9;
  const average = grades.reduce((acc, grade) => acc + grade.grade, 0) / len;
  const maleCount = grades.filter(
    (grade) => !grade.isAbsent && grade.student.gender == "male"
  ).length;
  const males10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "male"
    ).length / (maleCount == 0 ? 1e9 : maleCount);

  const femaleCount = grades.filter(
    (grade) => !grade.isAbsent && grade.student.gender == "female"
  ).length;
  const females10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "female"
    ).length / (femaleCount == 0 ? 1e9 : femaleCount);

  const isClosed = gradesheet.term.endDate
    ? gradesheet.term.endDate < new Date()
    : false;

  return (
    <div className="flex w-full flex-col gap-2 px-4 py-2">
      <Card className="p-0">
        <CardContent className="grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div className="font-medium">
                {gradesheet.subject.course.name}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("coeff")} : {gradesheet.subject.coefficient}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("Devoir")} : {gradesheet.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("teacher")} : {gradesheet.subject.teacher?.lastName}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div className="font-medium ">Informations</div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("date")} :{" "}
              {gradesheet.createdAt.toLocaleDateString(i18next.language, {
                year: "numeric",
                month: "long",
                weekday: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("scale")}: {gradesheet.scale}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("term")} : {gradesheet.term.name}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="font-medium ">Notes</div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("max_grade")} : {isFinite(maxGrade) ? maxGrade : "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("min_grade")} : {isFinite(minGrade) ? minGrade : "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("average")} : {average.toFixed(2)}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-orange-600" />
              <div className="font-medium ">{t("appreciation")}</div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {getAppreciations(average)}
            </Badge>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <span className="text-2xl font-bold ">{average.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="px-0 py-2">
          <CardContent>
            <div className="text-sm font-medium">{t("average")} ≥ 10</div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold ">{grades10}</span>
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
              <span className="text-sm font-medium ">
                {((grades10 * 100) / len).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <GradeDetailsHeader gradesheet={gradesheet} grades={allGrades} /> */}
      {isClosed && (
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
      )}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_25%] gap-2">
        <ClassroomGradeList gradesheet={gradesheet} grades={grades} />
        <ClassroomGradeChart grades={grades} />
      </div>
    </div>
  );
}
