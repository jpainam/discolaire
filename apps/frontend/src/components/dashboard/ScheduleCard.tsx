"use client";

import { useLocale } from "@repo/hooks/use-locale";
import { Separator } from "@repo/ui/separator";

import { cn } from "~/lib/utils";
import { DatePicker } from "../shared/date-picker";

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

export function ScheduleCard() {
  const { t } = useLocale();
  //const [today, setToday] = useState(new Date());
  const today = new Date();
  return (
    <div className="col-span-4 rounded-lg border">
      <div className="px-4 pt-2 text-center text-lg font-bold">
        {t("timetable")}
      </div>
      <div className="mb-4 flex flex-row items-center justify-between px-4">
        {/* <Button
          onClick={() => {
            setToday(addWeeks(today, -1));
          }}
          variant={"default"}
          size={"icon"}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button> */}
        <DatePicker
          //formatStr="d MMM"
          //className="h-8 w-[175px]"
          defaultValue={today}
        />
        {/* <Button
          onClick={() => {
            setToday(addWeeks(today, 1));
          }}
          variant={"default"}
          size={"icon"}
        >
          <ChevronRight className="h-6 w-6" />
        </Button> */}
      </div>
      <Separator />

      <div className="flex flex-col gap-4 py-2">
        {scheduleData.map((item, index) => {
          return (
            <div className="flex flex-row items-start gap-2" key={index}>
              <div className="w-16 text-right text-xs text-secondary-foreground">
                {item.startTime}
              </div>
              <div
                className={cn(item.color, "h-[60px] w-[6px] rounded-md")}
              ></div>
              <div className="flex flex-col gap-0">
                <span className="text-semibold text-sm">{item.subject}</span>
                <span className="text-xs text-muted-foreground">
                  {item.teacher}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.location}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
