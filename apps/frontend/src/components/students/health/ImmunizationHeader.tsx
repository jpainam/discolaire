import { cn } from "@/lib/utils";
import {
  CalendarClock,
  CalendarX2,
  CircleCheck,
  Clock,
  LucideIcon,
} from "lucide-react";

export function ImmunizationHeader() {
  return (
    <div className="grid divide-x md:grid-cols-4 my-2">
      <ImmunizationHeaderCard
        className="bg-green-50 dark:text-green-50 text-green-700 dark:bg-green-700/10 ring-green-600/20"
        icon={CircleCheck}
        n={0}
        state="Completed"
      />
      <ImmunizationHeaderCard
        className="bg-yellow-50 dark:text-yellow-50 text-yellow-800 dark:bg-yellow-400/10 ring-yellow-600/20"
        icon={CalendarClock}
        n={0}
        state="Due soon"
      />
      <ImmunizationHeaderCard
        className="bg-purple-50 dark:text-purple-50 text-purple-700 dark:bg-purple-700/10 ring-purple-700/10"
        icon={CalendarX2}
        n={0}
        state="Exempt"
      />
      <ImmunizationHeaderCard
        className="bg-red-50 dark:text-red-50 text-red-700 dark:bg-red-700/10 ring-red-600/10 dark:ring-red-60/10"
        icon={Clock}
        n={0}
        state="Overdue"
      />
    </div>
  );
}

function ImmunizationHeaderCard({
  icon,
  n,
  state,
  className,
  iconClassName,
}: {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  n: number;
  state: string;
}) {
  const Icon = icon;
  return (
    <div className="flex flex-col gap-0 items-center">
      <div
        className={cn(
          "w-12 h-12 items-center justify-center rounded-full flex",
          className
        )}
      >
        <Icon className={cn("w-6 h-6 stroke-1 items-center ", iconClassName)} />
      </div>
      <span className="text-sm font-bold">{n}</span>
      <span className="text-sm">{state}</span>
    </div>
  );
}
