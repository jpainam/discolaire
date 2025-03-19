import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import i18next from "i18next";
import { Calendar } from "lucide-react";
import { getServerTranslations } from "~/i18n/server";
import { api } from "~/trpc/server";
import { getAppreciations } from "~/utils/get-appreciation";
export async function StudentLatestGrade({
  studentId,
  name,
}: {
  studentId: string;
  name: string;
}) {
  const { t } = await getServerTranslations();
  const grades = await api.student.grades({ id: studentId });
  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "bg-green-100 text-green-800";
    if (grade >= 14) return "bg-blue-100 text-blue-800";
    if (grade >= 10) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("latest_grades")} - {name}
        </CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        {grades.slice(0, 5).map((grade, index) => {
          return (
            <div
              key={index}
              className="flex border-b justify-between py-2 items-center"
            >
              <div className="flex flex-col items-start gap-0">
                <h2 className="font-semibold ">
                  {grade.gradeSheet.subject.course.name}
                </h2>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    le{" "}
                    {grade.gradeSheet.createdAt.toLocaleDateString(
                      i18next.language,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end ">
                <div
                  className={`p-2 rounded-md text-sm font-bold ${getGradeColor(grade.grade)}`}
                >
                  {grade.grade.toFixed(2).replace(".", ",")}
                </div>
                <span className="text-xs mt-1 text-gray-500 font-medium">
                  {getAppreciations(grade.grade)}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
