"use client";

import { useParams } from "next/navigation";
import {
  CalendarCogIcon,
  CalendarDaysIcon,
  ChevronLeft,
  ChevronRight,
  Clock2Icon,
  Clock3Icon,
  DownloadIcon,
  MoreHorizontal,
  PlusIcon,
  PrinterIcon,
} from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import FlatBadge from "@repo/ui/FlatBadge";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import EyeIcon from "../icons/eye";
import { CreateEditLesson } from "./timetables/CreateEditLesson";

export default function TopTimetable() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const periods = [
    {
      id: "P1",
      subject: "English",
      start: "09:00",
      end: "09:40",
      startMins: 540,
      endMins: 580,
    },
    {
      id: "P2",
      subject: "Mathematics",
      start: "09:45",
      end: "10:25",
      startMins: 585,
      endMins: 625,
    },
    {
      id: "P3",
      subject: "French",
      start: "10:30",
      end: "11:10",
      startMins: 630,
      endMins: 670,
    },
    {
      id: "P4",
      subject: "Spanish",
      start: "11:40",
      end: "12:20",
      startMins: 700,
      endMins: 740,
    },
    {
      id: "P5",
      subject: "Design",
      start: "12:25",
      end: "13:05",
      startMins: 745,
      endMins: 785,
    },
    {
      id: "P6",
      subject: "Free Period",
      start: "13:50",
      end: "14:30",
      startMins: 830,
      endMins: 870,
    },
  ];
  const { t, i18n } = useLocale();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language, {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { openModal } = useModal();

  return (
    <Card className="m-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-bold">
          <CalendarDaysIcon className="h-4 w-4" />
          {t("timetable")}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-md capitalize">{formatDate(currentDate)}</span>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid w-full gap-0 overflow-x-auto px-0 md:flex">
          <div
            onClick={() => {
              console.log("prev");
            }}
            className="hidden h-[100px] cursor-pointer items-center px-1 hover:bg-muted/50 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </div>
          {periods.map((period) => (
            <div
              onClick={() => {
                alert("Show the details");
              }}
              key={period.id}
              className={cn(
                "mx-1 w-full cursor-pointer rounded-sm border p-2 hover:bg-muted/50",
                currentTime > period.endMins
                  ? "bg-muted opacity-50"
                  : "bg-card",
              )}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex flex-col gap-0">
                  <span className="overflow-hidden text-sm">
                    {"Dupont Pierre"}
                  </span>
                  <span className="overflow-hidden text-sm text-muted-foreground">
                    {period.subject}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <FlatBadge variant={"green"}>
                  <Clock2Icon className="mr-2 h-4 w-4" />
                  {period.start}
                </FlatBadge>
                <FlatBadge variant={"pink"}>
                  <Clock3Icon className="mr-2 h-4 w-4" />
                  {period.end}
                </FlatBadge>
              </div>
            </div>
          ))}
          <div
            onClick={() => {
              console.log("prev");
            }}
            className="hidden h-[100px] cursor-pointer items-center px-1 hover:bg-muted/50 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
        <div className="m-2 flex gap-2">
          <Button size={"sm"} variant="outline">
            <PrinterIcon className="mr-2 h-4 w-4" />
            {t("print_timetable")}
          </Button>
          <Button size={"sm"} variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            {t("export_timetable")}
          </Button>
          <Button size={"sm"} variant="outline">
            <EyeIcon className="mr-2 h-4 w-4" />
            {t("view_timetable")}
          </Button>
          <div className="ml-auto flex gap-2">
            <Button
              onClick={() => {
                openModal({
                  title: t("create_timetable"),
                  className: "w-[550px]",
                  view: <CreateEditLesson />,
                });
              }}
              size={"sm"}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {t("create_timetable")}
            </Button>
            <Button
              onClick={() => {
                router.push(routes.classrooms.timetables(params.id));
              }}
              size={"sm"}
              variant="secondary"
            >
              <CalendarCogIcon className="mr-2 h-4 w-4" />
              {t("manage_timetable")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
