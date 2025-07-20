import type { LucideIcon } from "lucide-react";
import { RiArrowRightUpLine } from "@remixicon/react";

import { cn } from "@repo/ui/lib/utils";

import { getServerTranslations } from "~/i18n/server";

export async function CountCard({
  icon,
  title,
  count,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  percentage,
  trend = "up",
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  trend?: "up" | "down";
  description?: string;
  percentage: number;
}) {
  const Icon = icon;
  const { i18n, t } = await getServerTranslations();
  const isPositive = trend === "up";
  const trendColor = isPositive ? "text-emerald-500" : "text-red-500";
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
          <Icon />
        </div>
        <div>
          <a
            href="#"
            className="text-muted-foreground/60 line-clamp-1 text-xs tracking-widest uppercase before:absolute before:inset-0"
          >
            {title}
          </a>
          <div className="mb-2 text-xl font-semibold">
            {count.toLocaleString(i18n.language)}
          </div>
          <div className="text-muted-foreground/60 text-xs">
            <span className={cn("font-medium", trendColor)}>
              {isPositive ? "↗" : "↘"} {percentage.toFixed(0)}
            </span>{" "}
            {t("percent_from_last_month")}
          </div>
        </div>
      </div>
    </div>
  );
}
