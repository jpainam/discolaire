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

  const newStudents = enrolled.filter((std) => std.isNew);
  const stats = [
    {
      title: "Tous les élèves",
      value: enrolled.length,
      delta: 15.1,
      lastMonth: 105922,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: "Nouveaux élèves",
      value: newStudents.length,
      delta: -2.0,
      lastMonth: 2002098,
      positive: false,
      prefix: "",
      suffix: "",
    },
    {
      title: "Garcons",
      value: maleCount,
      delta: 0.4,
      lastMonth: 97800000,
      positive: true,
      prefix: "$",
      suffix: "M",
      format: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
      lastFormat: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
    },
    {
      title: "Filles",
      value: femaleCount,
      delta: 3.7,
      lastMonth: 46480,
      positive: true,
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
                {stat.format
                  ? stat.format(stat.value)
                  : stat.prefix + formatNumber(stat.value) + stat.suffix}
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
                {stat.lastFormat
                  ? stat.lastFormat(stat.lastMonth)
                  : stat.prefix + formatNumber(stat.lastMonth) + stat.suffix}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
