"use client";

import { CalendarDays } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { DatePicker } from "~/components/DatePicker";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

interface ScheduleItem {
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  location: string;
  color: string;
}

const scheduleData: ScheduleItem[] = [
  {
    startTime: "9h00",
    endTime: "",
    subject: "FRANCAIS",
    teacher: "GALLET B.",
    location: "105",
    color: "bg-blue-500",
  },
  {
    startTime: "10h00",
    endTime: "",
    subject: "HISTOIRE-GÉOGRAPHIE",
    teacher: "MOREAU C.",
    location: "206",
    color: "bg-cyan-300",
  },
  {
    startTime: "11h00",
    endTime: "",
    subject: "MATHÉMATIQUES",
    teacher: "PROFESSEUR M.",
    location: "207",
    color: "bg-orange-300",
  },
  {
    startTime: "13h30",
    endTime: "14h30",
    subject: "SCIENCES DE LA VIE ET DE LA TERRE",
    teacher: "TESSIER A.",
    location: "Labo 2",
    color: "bg-indigo-700",
  },
  {
    startTime: "14h30",
    endTime: "15h30",
    subject: "ANGLAIS LV1",
    teacher: "BROWN J.",
    location: "103",
    color: "bg-yellow-200",
  },
];

export function ScheduleCard({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          {t("timetable")}
        </CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <CardAction>
          <DatePicker
            defaultValue={undefined}
            onSelectAction={(e) => {
              console.log(e);
            }}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        {scheduleData.map((item, index) => {
          return (
            <div className="flex flex-row items-start gap-2" key={index}>
              <div className="text-secondary-foreground w-16 text-right text-xs">
                {item.startTime}
              </div>
              <div
                className={cn(item.color, "h-[60px] w-[6px] rounded-md")}
              ></div>
              <div className="flex flex-col gap-0">
                <span className="text-semibold text-xs">{item.subject}</span>
                <span className="text-muted-foreground text-xs">
                  {item.teacher}
                </span>
                <span className="text-muted-foreground text-xs">
                  {item.location}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
