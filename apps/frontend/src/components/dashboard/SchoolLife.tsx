"use client";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
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
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
import {
  AlertTriangleIcon,
  AmbulanceIcon,
  ClockIcon,
  FileTextIcon,
  LifeBuoy,
  ThumbsUp,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocale } from "~/i18n";
import type { ChangeEvent } from "~/types/event_type";
import EyeIcon from "../icons/eye";
import { CardAction } from "../ui/card";

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

  const handleWeekChange = (event: ChangeEvent) => {
    const selectedWeek = event.target.value; // format: "YYYY-Wxx"
    if (!selectedWeek) return;

    // Convert to Date (Monday of the selected week)
    const year = parseInt(selectedWeek.substring(0, 4), 10);
    const week = parseInt(selectedWeek.substring(6), 10);

    // Calculate the first day of the selected week (Sunday-based)
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (week - 1) * 7;
    const selectedWeekStart = startOfWeek(
      new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd)),
      { weekStartsOn: 0 }
    );

    setSelectedDate(selectedWeekStart);
  };

  //const [today, setToday] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(selectedDate, { weekStartsOn: 0 });

  // const formatDate = Intl.DateTimeFormat(i18n.language, {
  //   month: "short",
  //   day: "numeric",
  // });
  // const dayFormat = Intl.DateTimeFormat(i18n.language, {
  //   weekday: "short",
  //   day: "numeric",
  // });

  // Generate weekdays
  const days = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate })
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
          <LifeBuoy />
          {t("school_life")}
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <Input type="week" onChange={handleWeekChange} />
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
      </CardContent>
    </Card>
  );
}
