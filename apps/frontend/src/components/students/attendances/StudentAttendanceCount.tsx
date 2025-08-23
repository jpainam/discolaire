"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Progress } from "@repo/ui/components/progress";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/lib/utils";

import { Badge } from "~/components/base-badge";
import { getLatenessValue } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function StudentAttendanceCount({ studentId }: { studentId: string }) {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");
  const { data: absence } = useSuspenseQuery(
    trpc.absence.byStudent.queryOptions({
      studentId,
      termId,
    }),
  );
  const { data: late } = useSuspenseQuery(
    trpc.lateness.byStudent.queryOptions({
      studentId,
      termId,
    }),
  );
  const { data: chatter } = useSuspenseQuery(
    trpc.chatter.byStudent.queryOptions({
      studentId,
      termId,
    }),
  );
  const { data: consigne } = useSuspenseQuery(
    trpc.consigne.byStudent.queryOptions({
      studentId,
      termId: termId ?? undefined,
    }),
  );

  const t = useTranslations();

  const performance = [
    {
      label: t("absence"),
      value: absence.map((ab) => ab.value).reduce((a, b) => a + b, 0),
      trend: 0,
      trendDir: "up",
    },
    {
      label: t("late"),
      value: late
        .map((l) => getLatenessValue(l.duration))
        .reduce((a, b) => a + b, 0),
      trend: 0,
      trendDir: "up",
    },
    {
      label: t("chatter"),
      value: chatter.map((c) => c.value).reduce((a, b) => a + b, 0),
      trend: 0,
      trendDir: "down",
    },
    {
      label: t("consigne"),
      value: consigne.map((c) => c.duration).reduce((a, b) => a + b, 0),
      trend: 0,
      trendDir: "up",
    },
  ];

  const activity = [
    {
      text: "Closed deal with FinSight Inc.",
      date: "Today",
      state: "secondary",
      color: "text-green-500",
    },
    {
      text: "3 new leads added to Pipeline.",
      date: "Yesterday",
      state: "secondary",
      color: "text-green-500",
    },
    {
      text: "Follow-up scheduled.",
      date: "2 days ago",
      state: "destructive",
      color: "text-destructive",
    },
  ];

  return (
    <div className="flex items-center justify-center pt-2 pr-2">
      {/* Card */}
      <div className="w-full">
        <div className="space-y-5">
          {/* Q3 Performance */}
          <div>
            <div className="mb-2.5 text-sm font-medium">{t("attendance")}</div>
            <div className="grid grid-cols-4 gap-1">
              {performance.map((item) => (
                <div
                  className="flex flex-col items-start justify-start"
                  key={item.label}
                >
                  <div className="text-foreground text-xl font-bold">
                    {item.value}
                  </div>
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    {item.label}
                  </div>

                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-semibold",
                      item.trendDir === "up"
                        ? "text-green-500"
                        : "text-destructive",
                    )}
                  >
                    {item.trendDir === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {item.trendDir === "up" ? "+" : "-"}
                    {item.trend}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pipeline Progress */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-foreground text-sm font-medium">
                {t("Attendance rate")}
              </span>
              <span className="text-foreground text-xs font-semibold">
                {0.5 * 100}%
              </span>
            </div>
            <Progress value={50} className="bg-muted" />
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <div className="text-foreground mb-2.5 text-sm font-medium">
              {t("Recent Activities")}
            </div>
            <ul className="space-y-2">
              {activity.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2.5 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className={cn("h-3.5 w-3.5", a.color)} />
                    <span className="text-foreground truncate text-xs">
                      {a.text}
                    </span>
                  </span>
                  <Badge
                    variant={
                      a.state === "secondary" ? "secondary" : "destructive"
                    }
                    appearance="light"
                    size="sm"
                  >
                    {a.date}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
