"use client";

import type { LucideIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import {
  AlarmClock,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Laptop2,
  Printer,
} from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DatePicker } from "~/components/shared/date-picker";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";

export function AttendanceHeader() {
  const { t } = useLocale();
  //const [query, setQuery] = useState<Record<string, any>>({});
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "hourly";
  const params = useParams<{ id: string }>();

  const items: { label: string; value: string; icon?: LucideIcon }[] = [
    { label: t("hourly_attendance"), value: "hourly", icon: AlarmClock },
    { label: t("weekly_attendance"), value: "weekly", icon: CalendarClock },
    { label: t("periodic_attendance"), value: "periodic", icon: CalendarDays },
    { label: t("digital_attendance"), value: "digital", icon: Laptop2 },
  ];

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();

  return (
    <div className="flex flex-row items-center gap-4 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      <Label className="min-w-[150px] max-w-[150px]">
        {t("attendance_type")}
      </Label>
      <Select
        defaultValue={searchParams.get("type") ?? undefined}
        onValueChange={(val) => {
          router.push(
            routes.classrooms.attendances.index(params.id) +
              "?" +
              createQueryString({ type: val }),
          );
        }}
      >
        <SelectTrigger className="min-w-[300px] max-w-[300px]">
          <SelectValue placeholder={t("select_attendance_type")} />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <SelectItem className="px-2" key={item.value} value={item.value}>
                <div className="flex flex-row items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {type == "hourly" && (
        <>
          <Label className="w-[150px]">{t("attendance_date")}</Label>
          <DatePicker
            onChange={(d) => {
              router.push(
                routes.classrooms.attendances.hourly(params.id) +
                  "?" +
                  createQueryString({ date: d.toISOString() }),
              );
            }}
            className="w-[200px]"
            defaultValue={new Date()}
          />
        </>
      )}
      {type == "weekly" && <></>}
      {type == "periodic" && (
        <>
          <Label>{t("term")}</Label>{" "}
          <TermSelector
            className="w-[300px]"
            onChange={(val) => {
              router.push(
                routes.classrooms.attendances.periodic(params.id) +
                  "?" +
                  createQueryString({ term: val }),
              );
            }}
          />
        </>
      )}

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex flex-row gap-1" variant="outline">
              <Printer className="h-4 w-4" />
              <span className="text-sm">{t("print")}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              Liste des presences/absences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              Liste des presences/absences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
