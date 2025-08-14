import { ArrowDown, ArrowUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { Badge } from "~/components/base-badge";
import { caller } from "~/trpc/server";

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return n.toLocaleString();
  return n.toString();
}

export async function StudentStatAdmin() {
  const enrolled = await caller.student.all({ limit: 10000 });
  const femaleCount = enrolled.filter((std) => std.gender == "female").length;
  const maleCount = enrolled.filter((std) => std.gender == "male").length;
  const previousYear = await caller.schoolYear.getPrevious();
  const previousStudents = await caller.enrollment.getStudents({
    schoolYearId: previousYear.id,
    limit: 10000,
  });
  const previousNew = previousStudents.filter((std) => std.isNew);
  const previousMale = previousStudents.filter((std) => std.gender == "male");
  const previousFemale = previousStudents.filter(
    (std) => std.gender == "female",
  );

  const newStudents = enrolled.filter((std) => std.isNew);
  const stats = [
    {
      title: "Tous les élèves",
      value: enrolled.length,
      delta:
        previousStudents.length === 0
          ? 0
          : Number(
              (
                ((enrolled.length - previousStudents.length) /
                  previousStudents.length) *
                100
              ).toFixed(1),
            ),
      lastMonth: previousStudents.length,
      positive: enrolled.length >= previousStudents.length,
      prefix: "",
      suffix: "",
    },
    {
      title: "Nouveaux élèves",
      value: newStudents.length,
      delta:
        previousStudents.length === 0
          ? 0
          : Number(
              (
                ((newStudents.length - previousNew.length) /
                  previousStudents.length) *
                100
              ).toFixed(1),
            ),
      lastMonth: previousNew.length,
      positive: newStudents.length >= previousNew.length,
      prefix: "",
      suffix: "",
    },
    {
      title: "Garcons",
      value: maleCount,
      delta:
        previousMale.length === 0
          ? 0
          : Number(
              (
                ((maleCount - previousMale.length) / previousMale.length) *
                100
              ).toFixed(1),
            ),
      lastMonth: previousMale.length,
      positive: maleCount >= previousMale.length,
      prefix: "",
      suffix: "",
      //format: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
      //lastFormat: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
    },
    {
      title: "Filles",
      value: femaleCount,
      delta:
        previousFemale.length === 0
          ? 0
          : Number(
              (
                ((femaleCount - previousFemale.length) /
                  previousFemale.length) *
                100
              ).toFixed(1),
            ),
      lastMonth: previousFemale.length,
      positive: femaleCount >= previousFemale.length,
      prefix: "",
      suffix: "",
    },
  ];
  return (
    <div className="grid grow grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="gap-2">
          <CardHeader className="border-0">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-foreground text-2xl font-medium tracking-tight">
                {/*stat.format
                  ? stat.format(stat.value)
                  : stat.prefix + formatNumber(stat.value) + stat.suffix*/}
                {stat.prefix + formatNumber(stat.value) + stat.suffix}
              </span>
              <Badge
                variant={stat.positive ? "success" : "destructive"}
                appearance="light"
              >
                {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                {stat.delta}%
              </Badge>
            </div>
            <div className="text-muted-foreground mt-2 border-t pt-2.5 text-xs">
              L'année dernière:{" "}
              <span className="text-foreground font-medium">
                {/* {stat.lastFormat
                  ? stat.lastFormat(stat.lastMonth)
                  : stat.prefix + formatNumber(stat.lastMonth) + stat.suffix} */}
                {stat.prefix + formatNumber(stat.lastMonth) + stat.suffix}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
