"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  eachDayOfInterval,
  endOfWeek,
  getDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import {
  AlertTriangleIcon,
  AmbulanceIcon,
  ClockIcon,
  FileTextIcon,
  LifeBuoy,
  UsersIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";

import { useIsMobile } from "~/hooks/use-mobile";
import { useTRPC } from "~/trpc/react";

const groupByWeekday = (items: { date: Date; value: number }[]) => {
  return items.reduce(
    (acc, item) => {
      const day = getDay(new Date(item.date)); // 0 (Sun) - 6 (Sat)
      if (day >= 1 && day <= 5) {
        const index = day - 1; // 0 (Mon) - 4 (Fri)
        acc[index] = (acc[index] ?? 0) + item.value;
      }
      return acc;
    },
    {} as Record<number, number>,
  );
};

export function SchoolLife({ className }: { className?: string }) {
  const trpc = useTRPC();
  const [startWeek, setStartWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [endWeek, setEndWeek] = useState<Date>(
    endOfWeek(new Date(), { weekStartsOn: 0 }),
  );

  const attendanceQuery = useQuery(
    trpc.attendance.all.queryOptions({ from: startWeek, to: endWeek }),
  );

  const visitQuery = useQuery(
    trpc.health.allvisits.queryOptions({ from: startWeek, to: endWeek }),
  );
  const isMobile = useIsMobile();

  const t = useTranslations();
  const locale = useLocale();

  const data = useMemo(() => {
    const attendances = attendanceQuery.data ?? [];
    const absenceCounts = groupByWeekday(
      attendances.map((a) => ({ date: a.createdAt, value: a.absence })),
    );

    const latenessCounts = groupByWeekday(
      attendances.map((l) => ({ date: l.createdAt, value: 1 })),
    );
    const visits = visitQuery.data ?? [];
    const visitCounts = groupByWeekday(
      visits.map((v) => ({ date: v.date, value: 1 })),
    );

    const exclusionCounts = groupByWeekday(
      attendances.map((e) => ({ date: e.createdAt, value: 1 })),
    );

    const convocationCounts = groupByWeekday(
      attendances.map((c) => ({ date: c.createdAt, value: 1 })),
    );

    return [
      {
        category: t("Absents"),
        icon: <UsersIcon className="text-primary h-4 w-4" />,
        mon: absenceCounts[0],
        tue: absenceCounts[1],
        wed: absenceCounts[2],
        thu: absenceCounts[3],
        fri: absenceCounts[4],
      },
      {
        category: t("Retardataires"),
        icon: <ClockIcon className="h-4 w-4 text-amber-500" />,
        mon: latenessCounts[0],
        tue: latenessCounts[1],
        wed: latenessCounts[2],
        thu: latenessCounts[3],
        fri: latenessCounts[4],
      },
      {
        category: t("Infirmary"),
        icon: <AmbulanceIcon className="h-4 w-4 text-red-500" />,
        mon: visitCounts[0],
        tue: visitCounts[1],
        wed: visitCounts[2],
        thu: visitCounts[3],
        fri: visitCounts[4],
      },
      {
        category: t("Exclusions"),
        icon: <AlertTriangleIcon className="h-4 w-4 text-orange-500" />,
        mon: exclusionCounts[0],
        tue: exclusionCounts[1],
        wed: exclusionCounts[2],
        thu: exclusionCounts[3],
        fri: exclusionCounts[4],
      },
      {
        category: "Convocations",
        icon: <FileTextIcon className="h-4 w-4 text-gray-500" />,
        mon: convocationCounts[0],
        tue: convocationCounts[1],
        wed: convocationCounts[2],
        thu: convocationCounts[3],
        fri: convocationCounts[4],
      },
    ];
  }, [attendanceQuery.data, visitQuery.data, t]);

  // {
  //   category: "Punitions notifiées",
  //   icon: <AlertTriangleIcon className="w-4 h-4 text-destructive" />,
  //   mon: 4,
  //   tue: 0,
  //   wed: 0,
  //   thu: 0,
  //   fri: 5,
  // },
  // {
  //   category: "Observations",
  //   icon: <EyeIcon className="w-4 h-4 text-blue-500" />,
  //   mon: 0,
  //   tue: 0,
  //   wed: 0,
  //   thu: 0,
  //   fri: 0,
  // },
  // {
  //   category: "Encouragements",
  //   icon: <ThumbsUp className="w-4 h-4 text-green-500" />,
  //   mon: 0,
  //   tue: 0,
  //   wed: 0,
  //   thu: 1,
  //   fri: 0,
  // },

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    if (!selectedDate) return;
    const date = parseISO(selectedDate);
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

    setStartWeek(weekStart);
    setEndWeek(weekEnd);
  };

  // Generate weekdays
  const days = eachDayOfInterval({ start: startWeek, end: endWeek })
    .slice(1, 6) // Select Monday to Friday
    .map((date) => {
      return date.toLocaleDateString(locale, {
        weekday: isMobile ? "narrow" : "short",
        //day: "2-digit",
      });
    });

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LifeBuoy className="h-4 w-4" />
          {t("school_life")}
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Input type="date" onChange={handleDateChange} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-y">
              <TableHead>
                {startWeek.toLocaleDateString(locale, {
                  //weekday: isMobile ? "narrow" : "short",
                  //month: "short",
                  day: "2-digit",
                })}{" "}
                -{" "}
                {endWeek.toLocaleDateString(locale, {
                  //weekday: isMobile ? "narrow" : "short",
                  month: "short",
                  day: "2-digit",
                })}
              </TableHead>
              {days.map((day, index) => (
                <TableHead key={index} className="w-[80px] text-right">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitQuery.isPending ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 16 }).map((_, index) => (
                      <Skeleton key={index} className="h-8" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {data.map((row) => {
                  const Icon = row.icon;
                  return (
                    <TableRow
                      key={row.category}
                      className="hover:bg-muted/10 border-b transition-colors"
                    >
                      <TableCell>
                        <Link
                          href={`/administration/attendances/?category=${row.category}`}
                          className="text-muted-foreground flex items-center gap-2 hover:text-blue-500 hover:underline"
                        >
                          {Icon}
                          {row.category}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={row.mon == 0 ? "secondary" : "outline"}
                          className={
                            (row.mon ?? 0) > 10
                              ? "text-destructive-foreground"
                              : ""
                          }
                        >
                          {row.mon ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={row.tue == 0 ? "secondary" : "outline"}
                          className={
                            (row.tue ?? 0) > 10
                              ? "text-destructive-foreground"
                              : ""
                          }
                        >
                          {row.mon ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={row.wed == 0 ? "secondary" : "outline"}
                          className={
                            (row.mon ?? 0) > 10
                              ? "text-destructive-foreground"
                              : ""
                          }
                        >
                          {row.wed ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={row.thu == 0 ? "secondary" : "outline"}
                          className={
                            (row.thu ?? 0) > 10
                              ? "text-destructive-foreground"
                              : ""
                          }
                        >
                          {row.mon ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={row.fri == 0 ? "secondary" : "outline"}
                          className={
                            (row.fri ?? 0) > 10
                              ? "text-destructive-foreground"
                              : ""
                          }
                        >
                          {row.mon ?? 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
