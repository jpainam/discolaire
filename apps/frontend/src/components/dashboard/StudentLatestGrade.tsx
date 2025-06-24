import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import i18next from "i18next";
import { CalendarDays } from "lucide-react";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import FlatBadge from "../FlatBadge";
export async function StudentLatestGrade({
  studentId,
  name,
}: {
  studentId: string;
  name: string;
}) {
  const { t } = await getServerTranslations();
  const grades = await caller.student.grades({ id: studentId });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Recent Grades")} - {name}
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        {grades.slice(0, 5).map((grade, index) => {
          return (
            <div
              key={index}
              className="flex border-b justify-between py-2 items-center"
              // style={{
              //   backgroundColor: "red",
              // }}
            >
              <div className="flex flex-col items-start gap-0">
                <span className="font-semibold text-sm ">
                  {grade.gradeSheet.subject.course.name}
                </span>
                <div className="flex items-center text-muted-foreground text-xs mt-1">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    le{" "}
                    {grade.gradeSheet.createdAt.toLocaleDateString(
                      i18next.language,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
              <FlatBadge
                className="w-[50px] items-center flex justify-center"
                variant={
                  grade.grade < 8
                    ? "red"
                    : grade.grade < 10
                      ? "blue"
                      : grade.grade < 14
                        ? "indigo"
                        : "green"
                }
              >
                {grade.grade}
              </FlatBadge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
