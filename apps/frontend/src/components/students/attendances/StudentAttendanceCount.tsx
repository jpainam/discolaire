"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";



import type { RouterOutputs } from "@repo/api";



import { Badge } from "~/components/base-badge";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";


interface PerfItem {
  label: string;
  value: number;
  trendPct: number | null; // null => n/a
  trendDir: "up" | "down";
}

export function StudentAttendanceCount({
  terms,
  studentId,
}: {
  terms: RouterOutputs["term"]["all"];
  studentId: string;
}) {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");
  const t = useTranslations();

  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.student.queryOptions({ studentId }),
  );

  const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

  const orderedTerms = useMemo(
    () => [...terms].sort((a, b) => a.order - b.order),
    [terms],
  );

  const currentTermIndex = useMemo(() => {
    if (termId) return orderedTerms.findIndex((t) => t.id === termId);
    return orderedTerms.length ? orderedTerms.length - 1 : -1;
  }, [orderedTerms, termId]);

  const prevTermId = useMemo(() => {
    if (currentTermIndex > 0)
      return orderedTerms[currentTermIndex - 1]?.id ?? null;
    return null;
  }, [currentTermIndex, orderedTerms]);

  // Aggregate current and previous values
  const totals = useMemo(() => {
    const currentAtt = attendances.filter((a) => a.termId == termId);
    const prevAtt = attendances.filter((a) => a.termId == prevTermId);
    const countAbsence = sum(currentAtt.map((a) => a.absence));
    const countChatter = sum(currentAtt.map((c) => c.chatter));
    const countConsigne = sum(currentAtt.map((c) => c.consigne));
    const countLate = sum(currentAtt.map((l) => l.late));

    const prevAbsence = sum(prevAtt.map((ab) => ab.absence));
    const prevChatter = sum(prevAtt.map((c) => c.chatter));
    const prevConsigne = sum(prevAtt.map((c) => c.consigne));
    const prevLate = sum(prevAtt.map((l) => l.late));

    return {
      current: { countAbsence, countChatter, countConsigne, countLate },
      prev: { prevAbsence, prevChatter, prevConsigne, prevLate },
    };
  }, [attendances, termId, prevTermId]);

  const trendPct = (curr: number, prev: number): number | null => {
    if (!prev || prev === 0) return null;
    return Math.round(((curr - prev) / prev) * 100);
  };

  // Build performance cards (note: for these metrics, an "up" trend is *bad*; we keep the arrow but color reflects dir)
  const performance: PerfItem[] = useMemo(() => {
    const items: { key: keyof typeof totals.current; label: string }[] = [
      { key: "countAbsence", label: t("absence") },
      { key: "countLate", label: t("late") },
      { key: "countChatter", label: t("chatter") },
      { key: "countConsigne", label: t("consigne") },
    ];

    return items.map(({ key, label }) => {
      const curr = totals.current[key];
      const prevKey =
        key === "countAbsence"
          ? "prevAbsence"
          : key === "countLate"
            ? "prevLate"
            : key === "countChatter"
              ? "prevChatter"
              : "prevConsigne";
      const prev = totals.prev[prevKey];

      const pct = trendPct(curr, prev);
      const dir: "up" | "down" = curr - prev >= 0 ? "up" : "down";

      return { label, value: curr, trendPct: pct, trendDir: dir };
    });
  }, [t, totals]);

  // You can compute a real attendance rate if you have "scheduled days" or "present days".
  // For now, we leave the placeholder 50% but keep it in one place.
  const attendanceRate = 50;

  const activity = [
    {
      text: "Closed deal with FinSight Inc.",
      date: "Today",
      state: "secondary" as const,
      color: "text-green-500",
    },
    {
      text: "3 new leads added to Pipeline.",
      date: "Yesterday",
      state: "secondary" as const,
      color: "text-green-500",
    },
    {
      text: "Follow-up scheduled.",
      date: "2 days ago",
      state: "destructive" as const,
      color: "text-destructive",
    },
  ];

  return (
    <div className="flex items-center justify-center pt-2 pr-2">
      <div className="w-full">
        <div className="space-y-5">
          {/* Attendance Overview */}
          <div>
            <Label className="mb-2.5 font-medium">
              {t("attendance")} {terms.find((t) => t.id == termId)?.name}
            </Label>
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

                  {/* <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-semibold",
                      item.trendDir === "up"
                        ? "text-destructive"
                        : "text-green-500",
                    )}
                    title={
                      item.trendPct === null
                        ? t("No previous term to compare")
                        : `${item.trendPct > 0 ? "+" : ""}${item.trendPct}%`
                    }
                  >
                    {item.trendDir === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {item?.trendPct > 0 ? "+" : ""}${item.trendPct}%`}
                  </span> */}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Attendance Rate */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <Label className="text-foreground font-medium">
                {t("Attendance rate")}
              </Label>
              <span className="text-foreground text-xs font-semibold">
                {attendanceRate}%
              </span>
            </div>
            <Progress value={attendanceRate} className="bg-muted" />
          </div>

          <Separator />

          {/* Recent Activity (replace with your domain data or remove) */}
          <div>
            <Label className="text-foreground mb-2.5 font-medium">
              {t("Recent Activities")}
            </Label>
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