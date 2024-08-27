import type {
  LucideIcon} from "lucide-react";
import {
  CalendarClock,
  CalendarX2,
  CircleCheck,
  Clock
} from "lucide-react";

import { cn } from "~/lib/utils";

export function ImmunizationHeader() {
  return (
    <div className="my-2 grid divide-x md:grid-cols-4">
      <ImmunizationHeaderCard
        className="bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-700/10 dark:text-green-50"
        icon={CircleCheck}
        n={0}
        state="Completed"
      />
      <ImmunizationHeaderCard
        className="bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-50"
        icon={CalendarClock}
        n={0}
        state="Due soon"
      />
      <ImmunizationHeaderCard
        className="bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-700/10 dark:text-purple-50"
        icon={CalendarX2}
        n={0}
        state="Exempt"
      />
      <ImmunizationHeaderCard
        className="dark:ring-red-60/10 bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-700/10 dark:text-red-50"
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
    <div className="flex flex-col items-center gap-0">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          className,
        )}
      >
        <Icon className={cn("h-6 w-6 items-center stroke-1", iconClassName)} />
      </div>
      <span className="text-sm font-bold">{n}</span>
      <span className="text-sm">{state}</span>
    </div>
  );
}
