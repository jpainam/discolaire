"use client";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import {
  AlertTriangleIcon,
  AmbulanceIcon,
  ClockIcon,
  FileTextIcon,
  LifeBuoy,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { Skeleton } from "../ui/skeleton";

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
    {} as Record<number, number>
  );
};

export function SchoolLife({ className }: { className?: string }) {
  const trpc = useTRPC();
  const [startWeek, setStartWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [endWeek, setEndWeek] = useState<Date>(
    endOfWeek(new Date(), { weekStartsOn: 0 })
  );

  const absenceQuery = useQuery(
    trpc.absence.all.queryOptions({ from: startWeek, to: endWeek })
  );
  const lateQuery = useQuery(
    trpc.lateness.all.queryOptions({ from: startWeek, to: endWeek })
  );
  const convocationQuery = useQuery(
    trpc.convocation.all.queryOptions({ from: startWeek, to: endWeek })
  );
  const exclusionQuery = useQuery(
    trpc.exclusion.all.queryOptions({ from: startWeek, to: endWeek })
  );
  const visitQuery = useQuery(
    trpc.health.allvisits.queryOptions({ from: startWeek, to: endWeek })
  );

  const [data, setData] = useState<
    {
      category: string;
      icon: React.ReactNode;
      mon?: number;
      tue?: number;
      wed?: number;
      thu?: number;
      fri?: number;
    }[]
  >();
  const { t, i18n } = useLocale();

  useEffect(() => {
    const absences = absenceQuery.data ?? [];
    const absenceCounts = groupByWeekday(
      absences.map((a) => ({ date: a.date, value: a.value }))
    );
    const lates = lateQuery.data ?? [];
    const latenessCounts = groupByWeekday(
      lates.map((l) => ({ date: l.date, value: 1 }))
    );
    const visits = visitQuery.data ?? [];
    const visitCounts = groupByWeekday(
      visits.map((v) => ({ date: v.date, value: 1 }))
    );
    const exclusions = exclusionQuery.data ?? [];
    const exclusionCounts = groupByWeekday(
      exclusions.map((e) => ({ date: e.startDate, value: 1 }))
    );
    const convocations = convocationQuery.data ?? [];
    const convocationCounts = groupByWeekday(
      convocations.map((c) => ({ date: c.date, value: 1 }))
    );

    const summary = [
      {
        category: t("Absents"),
        icon: <UsersIcon className="h-4 w-4 text-primary" />,
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
        category: t("Visits to the infirmary"),
        icon: <AmbulanceIcon className="h-4 w-4 text-red-500" />,
        mon: visitCounts[0],
        tue: visitCounts[1],
        wed: visitCounts[2],
        thu: visitCounts[3],
        fri: visitCounts[4],
      },
      {
        category: t("Course exclusions"),
        icon: <AlertTriangleIcon className="w-4 h-4 text-orange-500" />,
        mon: exclusionCounts[0],
        tue: exclusionCounts[1],
        wed: exclusionCounts[2],
        thu: exclusionCounts[3],
        fri: exclusionCounts[4],
      },
      {
        category: "Convocations",
        icon: <FileTextIcon className="w-4 h-4 text-gray-500" />,
        mon: convocationCounts[0],
        tue: convocationCounts[1],
        wed: convocationCounts[2],
        thu: convocationCounts[3],
        fri: convocationCounts[4],
      },
    ];

    setData(summary);
  }, [
    absenceQuery.data,
    lateQuery.data,
    visitQuery.data,
    exclusionQuery.data,
    convocationQuery.data,
    t,
  ]);

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
    .map((date) =>
      format(date, "EEE d", {
        locale:
          i18n.language === "fr" ? fr : i18n.language === "es" ? es : enUS,
      })
    );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LifeBuoy className="w-4 h-4" />
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
              <TableHead>Catégorie</TableHead>
              {days.map((day, index) => (
                <TableHead key={index} className="text-right w-[80px]">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {absenceQuery.isPending ||
            lateQuery.isPending ||
            visitQuery.isPending ||
            exclusionQuery.isPending ||
            convocationQuery.isPending ? (
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
                {data?.map((row) => {
                  const Icon = row.icon;
                  return (
                    <TableRow
                      key={row.category}
                      className="border-b hover:bg-muted/10 transition-colors"
                    >
                      <TableCell>
                        <Link
                          href={`/administration/attendances/?category=${row.category}`}
                          className="text-muted-foreground hover:text-blue-500 hover:underline  flex items-center gap-2"
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
                              ? " text-destructive-foreground"
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
                              ? " text-destructive-foreground"
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
                              ? " text-destructive-foreground"
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
                              ? " text-destructive-foreground"
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
                              ? " text-destructive-foreground"
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
