"use client";

import { useState } from "react";
import { addWeeks, endOfWeek, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Separator } from "@repo/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export function SchoolLife() {
  const data = [
    { category: "Absents", mon: 98, tue: 64, wed: 64, thu: 64, fri: 64 },
    { category: "Retardataires", mon: 0, tue: 0, wed: 1, thu: 1, fri: 0 },
    {
      category: "Passages à l'infirmerie",
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
    },
    { category: "Exclusions de cours", mon: 3, tue: 0, wed: 0, thu: 0, fri: 1 },
    { category: "Punitions notifiées", mon: 4, tue: 0, wed: 0, thu: 0, fri: 5 },
    { category: "Observations", mon: 0, tue: 0, wed: 0, thu: 0, fri: 0 },
    { category: "Encouragements", mon: 0, tue: 0, wed: 0, thu: 1, fri: 0 },
    {
      category: "Convocations",
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

  return (
    <div className="col-span-4 rounded-lg border">
      <div className="px-4 pt-2 text-center text-lg font-bold">
        {t("school_life")}
      </div>
      <div className="mb-4 flex flex-row items-center justify-between px-2">
        <Button
          onClick={() => {
            setToday(addWeeks(today, -1));
          }}
          variant={"default"}
          size={"icon"}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
          {formatDate.format(startOfWeekDate)} -
          {formatDate.format(endOfWeekDate)}
        </div>
        <Button
          onClick={() => {
            setToday(addWeeks(today, 1));
          }}
          variant={"default"}
          size={"icon"}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead className="text-right">lun. 18</TableHead>
            <TableHead className="text-right">mar. 19</TableHead>
            <TableHead className="text-right">mer. 20</TableHead>
            <TableHead className="text-right">jeu. 21</TableHead>
            <TableHead className="text-right">ven. 22</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.category}>
              <TableCell className="font-medium">{row.category}</TableCell>
              <TableCell className="text-right">{row.mon}</TableCell>
              <TableCell className="text-right">{row.tue}</TableCell>
              <TableCell className="text-right">{row.wed}</TableCell>
              <TableCell className="text-right">{row.thu}</TableCell>
              <TableCell className="text-right">{row.fri}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
