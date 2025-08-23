"use client";

import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { Progress } from "@repo/ui/components/progress";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/lib/utils";

import { Badge } from "~/components/base-badge";
import { getLatenessValue } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function StudentAttendanceCount({
  terms,
  studentId,
}: {
  terms: RouterOutputs["term"]["all"];
  studentId: string;
}) {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");
  const { data: absence } = useSuspenseQuery(
    trpc.absence.byStudent.queryOptions({
      studentId,
    }),
  );
  const { data: late } = useSuspenseQuery(
    trpc.lateness.byStudent.queryOptions({
      studentId,
    }),
  );
  const { data: chatter } = useSuspenseQuery(
    trpc.chatter.byStudent.queryOptions({
      studentId,
    }),
  );
  const { data: consigne } = useSuspenseQuery(
    trpc.consigne.byStudent.queryOptions({
      studentId,
    }),
  );

  const t = useTranslations();
  const [performance, setPerformance] = useState<
    { label: string; value: number; trend: number; trendDir: "up" | "down" }[]
  >([
    {
      label: t("absence"),
      value: 0,
      trend: 0,
      trendDir: "up",
    },
    {
      label: t("late"),
      value: 0,
      trend: 0,
      trendDir: "up",
    },
    {
      label: t("chatter"),
      value: 0,
      trend: 0,
      trendDir: "down",
    },
    {
      label: t("consigne"),
      value: 0,
      trend: 0,
      trendDir: "up",
    },
  ]);

  useEffect(() => {
    let allAbsence = absence;
    let allChatter = chatter;
    let allConsigne = consigne;
    let allLate = late;
    let prevAbsence = 0;
    let prevChatter = 0;
    let prevConsigne = 0;
    let prevLate = 0;
    if (!termId) {
      allAbsence = absence.filter((a) => a.termId === termId);
      allChatter = chatter.filter((c) => c.termId === termId);
      allConsigne = consigne.filter((c) => c.termId === termId);
      allLate = late.filter((l) => l.termId === termId);
    }
    const orderedTerms = terms.sort((a, b) => a.order - b.order);
    const currentTermIndex = orderedTerms.findIndex((t) => t.id === termId);
    let prevTermId = null;
    if (currentTermIndex > 0) {
      const prevTerm = orderedTerms[currentTermIndex - 1];
      if (prevTerm) prevTermId = prevTerm.id;
    }
    if (prevTermId) {
      const prevAbs = absence.filter((a) => a.termId === prevTermId);
      const prevChat = chatter.filter((c) => c.termId === prevTermId);
      const prevCons = consigne.filter((c) => c.termId === prevTermId);
      const prevL = late.filter((l) => l.termId === prevTermId);
      prevAbsence = prevAbs.map((ab) => ab.value).reduce((a, b) => a + b, 0);
      prevChatter = prevChat.map((c) => c.value).reduce((a, b) => a + b, 0);
      prevConsigne = prevCons.map((c) => c.duration).reduce((a, b) => a + b, 0);
      prevLate = prevL
        .map((l) => getLatenessValue(l.duration))
        .reduce((a, b) => a + b, 0);
    }
    const countAbsence = allAbsence
      .map((ab) => ab.value)
      .reduce((a, b) => a + b, 0);
    const countConsigne = allConsigne
      .map((c) => c.duration)
      .reduce((a, b) => a + b, 0);
    const countChatter = allChatter
      .map((c) => c.value)
      .reduce((a, b) => a + b, 0);
    const countLate = allLate
      .map((l) => getLatenessValue(l.duration))
      .reduce((a, b) => a + b, 0);

    setPerformance([
      {
        label: t("absence"),
        value: countAbsence,
        trend: prevAbsence
          ? Math.round(((countAbsence - prevAbsence) / prevAbsence) * 100)
          : 0,
        trendDir: countAbsence - prevAbsence >= 0 ? "up" : "down",
      },
      {
        label: t("late"),
        value: countLate,
        trend: prevLate
          ? Math.round(((countLate - prevLate) / prevLate) * 100)
          : 0,
        trendDir: countLate - prevLate >= 0 ? "up" : "down",
      },
      {
        label: t("chatter"),
        value: countChatter,
        trend: prevChatter
          ? Math.round(((countChatter - prevChatter) / prevChatter) * 100)
          : 0,
        trendDir: countChatter - prevChatter >= 0 ? "up" : "down",
      },
      {
        label: t("consigne"),
        value: countConsigne,
        trend: prevConsigne
          ? Math.round(((countConsigne - prevConsigne) / prevConsigne) * 100)
          : 0,
        trendDir: countConsigne - prevConsigne >= 0 ? "up" : "down",
      },
    ]);
  }, [absence, chatter, consigne, late, t, termId, terms]);

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
