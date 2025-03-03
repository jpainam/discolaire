"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import {
  AlertTriangleIcon,
  AmbulanceIcon,
  ChevronLeft,
  ChevronRight,
  ClockIcon,
  FileTextIcon,
  ThumbsUp,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "~/i18n";
import EyeIcon from "../icons/eye";

export function SchoolLife({ className }: { className?: string }) {
  const data = [
    {
      category: "Absents",
      icon: <UsersIcon className="h-4 w-4 text-primary" />,
      mon: 98,
      tue: 64,
      wed: 64,
      thu: 64,
      fri: 64,
    },
    {
      category: "Retardataires",
      icon: <ClockIcon className="h-4 w-4 text-amber-500" />,
      mon: 0,
      tue: 0,
      wed: 1,
      thu: 1,
      fri: 0,
    },
    {
      category: "Passages à l'infirmerie",
      icon: <AmbulanceIcon className="h-4 w-4 text-red-500" />,
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
    },
    {
      category: "Exclusions de cours",
      icon: <AlertTriangleIcon className="w-4 h-4 text-orange-500" />,
      mon: 3,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 1,
    },
    {
      category: "Punitions notifiées",
      icon: <AlertTriangleIcon className="w-4 h-4 text-destructive" />,
      mon: 4,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 5,
    },
    {
      category: "Observations",
      icon: <EyeIcon className="w-4 h-4 text-blue-500" />,
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
    },
    {
      category: "Encouragements",
      icon: <ThumbsUp className="w-4 h-4 text-green-500" />,
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 1,
      fri: 0,
    },
    {
      category: "Convocations",
      icon: <FileTextIcon className="w-4 h-4 text-gray-500" />,
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
    },
  ];
  const { t, i18n } = useLocale();

  const [today, setToday] = useState(new Date());
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(today, { weekStartsOn: 0 });
  const formatDate = Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
  });
  // const dayFormat = Intl.DateTimeFormat(i18n.language, {
  //   weekday: "short",
  //   day: "numeric",
  // });

  const days = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate })
    .slice(1, 6) // Select Monday to Friday
    .map((date) =>
      format(date, "EEE d", {
        locale: i18n.language == "fr" ? fr : i18n.language == "es" ? es : enUS,
      }),
    );

  return (
    <div className={cn("w-full rounded-lg border overflow-hidden", className)}>
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("school_life")}</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setToday(addWeeks(today, -1));
            }}
            className="h-8 w-8 rounded-full"
            variant={"outline"}
            size={"icon"}
          >
            <span className="sr-only">Previous week</span>
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="px-4 w-[200px] text-center py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {formatDate.format(startOfWeekDate)} -{" "}
            {formatDate.format(endOfWeekDate)}
          </div>
          <Button
            onClick={() => {
              setToday(addWeeks(today, 1));
            }}
            className="h-8 w-8 rounded-full"
            variant={"outline"}
            size={"icon"}
          >
            <span className="sr-only">Next week</span>
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="bg-background overflow-x-auto border-b">
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
            {data.map((row) => {
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
                        row.mon > 10 ? " text-destructive-foreground" : ""
                      }
                    >
                      {row.mon}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={row.tue == 0 ? "secondary" : "outline"}
                      className={
                        row.tue > 10 ? " text-destructive-foreground" : ""
                      }
                    >
                      {row.mon}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={row.wed == 0 ? "secondary" : "outline"}
                      className={
                        row.mon > 10 ? " text-destructive-foreground" : ""
                      }
                    >
                      {row.wed}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={row.thu == 0 ? "secondary" : "outline"}
                      className={
                        row.thu > 10 ? " text-destructive-foreground" : ""
                      }
                    >
                      {row.mon}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={row.fri == 0 ? "secondary" : "outline"}
                      className={
                        row.fri > 10 ? " text-destructive-foreground" : ""
                      }
                    >
                      {row.mon}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
