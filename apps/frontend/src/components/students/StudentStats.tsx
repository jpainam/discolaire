"use client";

import { RiArrowRightUpLine } from "@remixicon/react";

import { cn } from "@repo/ui/lib/utils";

import { useLocale } from "~/i18n";

interface StatsCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
  };
  icon: React.ReactNode;
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const isPositive = change.trend === "up";
  const trendColor = isPositive ? "text-emerald-500" : "text-red-500";
  const { t } = useLocale();

  return (
    <div className="group before:from-input/30 before:via-input before:to-input/30 relative p-4 before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b last:before:hidden lg:p-5">
      <div className="relative flex items-center gap-4">
        <RiArrowRightUpLine
          className="absolute top-0 right-0 text-emerald-500 opacity-0 transition-opacity group-has-[a:hover]:opacity-100"
          size={20}
          aria-hidden="true"
        />
        {/* Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-600/25 text-emerald-500 max-[480px]:hidden">
          {icon}
        </div>
        {/* Content */}
        <div>
          <a
            href="#"
            className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase before:absolute before:inset-0"
          >
            {title}
          </a>
          <div className="mb-2 text-xl font-semibold">{value}</div>
          <div className="text-muted-foreground/60 text-xs">
            <span className={cn("font-medium", trendColor)}>
              {isPositive ? "↗" : "↘"} {change.value}
            </span>{" "}
            {t("vs_last_year")}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatsCardProps[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "border-border from-sidebar/60 to-sidebar grid grid-cols-2 rounded-xl border bg-gradient-to-br min-[1200px]:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
