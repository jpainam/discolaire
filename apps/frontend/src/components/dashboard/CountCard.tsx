import type { LucideIcon } from "lucide-react";

import { getServerTranslations } from "~/i18n/server";

import { RiArrowRightUpLine } from "@remixicon/react";
import { cn } from "@repo/ui/lib/utils";

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
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-input/30 before:via-input before:to-input/30 last:before:hidden">
      <div className="relative flex items-center gap-4">
        <RiArrowRightUpLine
          className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
          size={20}
          aria-hidden="true"
        />
        {/* Icon */}
        <div className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-emerald-600/25 border border-emerald-600/50 flex items-center justify-center text-emerald-500">
          <Icon />
        </div>
        <div>
          <a
            href="#"
            className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 before:absolute before:inset-0"
          >
            {title}
          </a>
          <div className="text-2xl font-semibold mb-2">
            {count.toLocaleString(i18n.language)}
          </div>
          <div className="text-xs text-muted-foreground/60">
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
