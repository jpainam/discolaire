"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
  BaselineIcon,
  ChevronDown,
  DiameterIcon,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";

export function AttendanceHeader() {
  const { t } = useLocale();
  //const [query, setQuery] = useState<Record<string, any>>({});
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();

  // const items: { label: string; value: string; icon?: LucideIcon }[] = [
  //   { label: t("hourly_attendance"), value: "hourly", icon: AlarmClock },
  //   { label: t("weekly_attendance"), value: "weekly", icon: CalendarClock },
  //   { label: t("periodic_attendance"), value: "periodic", icon: CalendarDays },
  //   { label: t("digital_attendance"), value: "digital", icon: Laptop2 },
  // ];

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const termId = searchParams.get("term");

  return (
    <div className="grid flex-row items-center gap-4 border-b bg-muted px-2 py-1 md:flex">
      <Label className="hidden md:block">{t("periods")}</Label>
      <TermSelector
        className="md:w-[300px]"
        defaultValue={termId}
        onChange={(val) => {
          router.push(
            routes.classrooms.attendances.index(params.id) +
              "?" +
              createQueryString({ term: val }),
          );
        }}
      />
      <Label>{t("type")}</Label>
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
        <SelectTrigger className="md:w-[200px]">
          <SelectValue placeholder={t("all_types")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="absence">{t("absence")}</SelectItem>
          <SelectItem value="late">{t("late")}</SelectItem>
          <SelectItem value="chatter">{t("chatter")}</SelectItem>
          <SelectItem value="consigne">{t("consigne")}</SelectItem>
          <SelectItem value="exclusion">{t("exclusion")}</SelectItem>
        </SelectContent>
      </Select>
      <Label>{t("date")}</Label>
      <Input
        type="date"
        className="md:w-[200px]"
        onChange={(e) => {
          router.push(
            routes.classrooms.attendances.index(params.id) +
              "?" +
              createQueryString({ date: e.target.value }),
          );
        }}
      />

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!termId} size={"sm"}>
              {t("add")}
              <ChevronDown
                className="-me-1 ms-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.absences(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") }),
                );
              }}
            >
              <BaselineIcon className="mr-2 h-4 w-4" />
              {t("absence")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.lateness(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") }),
                );
              }}
            >
              <DiameterIcon className="mr-2 h-4 w-4" />
              {t("lateness")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.chatters(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") }),
                );
              }}
            >
              <NewspaperIcon className="mr-2 h-4 w-4" />
              {t("chatter")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.consignes(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") }),
                );
              }}
            >
              <ShapesIcon className="mr-2 h-4 w-4" />
              {t("consigne")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.exclusions(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") }),
                );
              }}
            >
              <ShieldAlertIcon className="mr-2 h-4 w-4" />
              {t("exclusion")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
