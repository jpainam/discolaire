"use client";

import { addDays, isSameDay, subDays } from "date-fns";
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
import { useParams } from "next/navigation";
import { useState } from "react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";
import { Skeleton } from "@repo/ui/components/skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import EyeIcon from "~/components/icons/eye";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { CreateEditLesson } from "./timetables/CreateEditLesson";

export default function TopTimetable() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const [today, setToday] = useState<Date>(new Date());
  const timetablesQuery = useQuery(
    trpc.subjectTimetable.byClassroom.queryOptions({
      classroomId: params.id,
      from: subDays(today, 7),
    }),
  );

  const periods = timetablesQuery.data ?? [];
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

  const { openModal } = useModal();

  return (
    <Card className="m-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2 py-1">
        <CardTitle className="text-md flex flex-row items-center gap-2 font-bold">
          <CalendarDaysIcon className="h-4 w-4" />
          {t("timetable")}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              setToday(subDays(today, 1));
            }}
            variant="ghost"
            size="icon"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs capitalize">{formatDate(today)}</span>
          <Button
            variant="ghost"
            onClick={() => {
              setToday(addDays(today, 1));
            }}
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {timetablesQuery.isPending ? (
          <div className="grid grid-cols-5 gap-2 px-4">
            {Array.from({ length: 5 }).map((_, index) => {
              return <Skeleton key={index} className="h-20" />;
            })}
          </div>
        ) : (
          <Carousel className="mx-[55px]">
            <CarouselContent>
              {periods.map((period, index) => {
                return (
                  <CarouselItem
                    key={index}
                    className="pl-1 md:basis-1/4 lg:basis-1/5"
                  >
                    <TopTimetableCard period={period} today={today} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
        {/* <div className="grid w-full gap-0 overflow-x-auto px-0 md:flex">
          <div
            onClick={() => {
              setCurrentDate(subDays(currentDate, 1));
            }}
            className="hidden h-[100px] cursor-pointer items-center px-1 hover:bg-muted/50 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </div>
          {periods.map((period) => {
            return <TopTimetableCard period={period} today={today} />;
          })}
          <div
            onClick={() => {
              setCurrentDate(addDays(currentDate, 1));
            }}
            className="hidden h-[100px] cursor-pointer items-center px-1 hover:bg-muted/50 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </div>
        </div> */}
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
                  title: t("add"),
                  view: <CreateEditLesson />,
                });
              }}
              size={"sm"}
            >
              <PlusIcon />
              {t("add")}
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

function TopTimetableCard({
  today,
  period,
}: {
  today: Date;
  period: RouterOutputs["subjectTimetable"]["byClassroom"][number];
}) {
  const { i18n } = useLocale();

  return (
    <div
      onClick={() => {
        alert("Show the details");
      }}
      key={period.id}
      className={cn(
        "mx-1 w-full cursor-pointer rounded-sm border p-2 hover:bg-muted/50",
        today > period.end
          ? "bg-muted opacity-50"
          : isSameDay(period.start, today)
            ? "bg-red-600"
            : "bg-card",
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col gap-0">
          <span className="overflow-hidden text-xs font-semibold">
            {period.subject.teacher?.lastName}
          </span>
          <span className="overflow-hidden text-xs text-muted-foreground">
            {period.subject.course.name}
          </span>
        </div>
        <div className="text-xs font-extralight">
          {period.start.toLocaleDateString(i18n.language, {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
        </div>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <FlatBadge variant={"green"}>
          <Clock2Icon className="mr-2 h-4 w-4" />
          {period.start.toLocaleTimeString(i18n.language, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </FlatBadge>
        <FlatBadge variant={"pink"}>
          <Clock3Icon className="mr-2 h-4 w-4" />
          {period.end.toLocaleTimeString(i18n.language, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </FlatBadge>
      </div>
    </div>
  );
}
