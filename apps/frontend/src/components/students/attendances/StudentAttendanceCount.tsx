"use client";

import { useMemo } from "react";
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

  // Fetches (suspense guarantees data presence)
  const { data: absence = [] } = useSuspenseQuery(
    trpc.absence.byStudent.queryOptions({ studentId }),
  );
  const { data: late = [] } = useSuspenseQuery(
    trpc.lateness.byStudent.queryOptions({ studentId }),
  );
  const { data: chatter = [] } = useSuspenseQuery(
    trpc.chatter.byStudent.queryOptions({ studentId }),
  );
  const { data: consigne = [] } = useSuspenseQuery(
    trpc.consigne.byStudent.queryOptions({ studentId }),
  );

  // ---------- Helpers ----------
  const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

  const orderedTerms = useMemo(
    () => [...terms].sort((a, b) => a.order - b.order),
    [terms],
  );

  // Current term index:
  //  - if a termId is selected, use it
  //  - otherwise assume the last term (highest order) as "current" for comparisons
  const currentTermIndex = useMemo(() => {
    if (termId) return orderedTerms.findIndex((t) => t.id === termId);
    return orderedTerms.length ? orderedTerms.length - 1 : -1;
  }, [orderedTerms, termId]);

  const prevTermId = useMemo(() => {
    if (currentTermIndex > 0)
      return orderedTerms[currentTermIndex - 1]?.id ?? null;
    return null;
  }, [currentTermIndex, orderedTerms]);

  // Filter to selected term if any (otherwise include all)
  const filtered = useMemo(() => {
    const byTerm = <T extends { termId: string }>(arr: T[]) =>
      termId ? arr.filter((x) => x.termId === termId) : arr;

    const prevByTerm = <T extends { termId: string }>(arr: T[]) =>
      prevTermId ? arr.filter((x) => x.termId === prevTermId) : [];

    return {
      // current
      absence: byTerm(absence),
      late: byTerm(late),
      chatter: byTerm(chatter),
      consigne: byTerm(consigne),
      // previous
      prevAbsence: prevByTerm(absence),
      prevLate: prevByTerm(late),
      prevChatter: prevByTerm(chatter),
      prevConsigne: prevByTerm(consigne),
    };
  }, [absence, late, chatter, consigne, termId, prevTermId]);

  // Aggregate current and previous values
  const totals = useMemo(() => {
    const countAbsence = sum(filtered.absence.map((ab) => ab.value));
    const countChatter = sum(filtered.chatter.map((c) => c.value));
    const countConsigne = sum(filtered.consigne.map((c) => c.duration)); // assuming minutes
    const countLate = sum(
      filtered.late.map((l) => getLatenessValue(l.duration)),
    );

    const prevAbsence = sum(filtered.prevAbsence.map((ab) => ab.value));
    const prevChatter = sum(filtered.prevChatter.map((c) => c.value));
    const prevConsigne = sum(filtered.prevConsigne.map((c) => c.duration));
    const prevLate = sum(
      filtered.prevLate.map((l) => getLatenessValue(l.duration)),
    );

    return {
      current: { countAbsence, countChatter, countConsigne, countLate },
      prev: { prevAbsence, prevChatter, prevConsigne, prevLate },
    };
  }, [filtered]);

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
            <div className="mb-2.5 text-sm font-medium">
              {t("attendance")} {terms.find((t) => t.id == termId)?.name}
            </div>
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
                    {item.trendPct === null
                      ? "n/a"
                      : `${item.trendPct > 0 ? "+" : ""}${item.trendPct}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Attendance Rate */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-foreground text-sm font-medium">
                {t("Attendance rate")}
              </span>
              <span className="text-foreground text-xs font-semibold">
                {attendanceRate}%
              </span>
            </div>
            <Progress value={attendanceRate} className="bg-muted" />
          </div>

          <Separator />

          {/* Recent Activity (replace with your domain data or remove) */}
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
