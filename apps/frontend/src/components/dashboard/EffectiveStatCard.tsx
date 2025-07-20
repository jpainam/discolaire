import { PiGenderFemale, PiGenderMale } from "react-icons/pi";

import { getServerTranslations } from "~/i18n/server";
import { cn } from "~/lib/utils";
import { EffectiveStatCounter } from "./EffectiveStatCounter";

interface StatCardProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  total: number;
  male?: number;
  female?: number;
  secondTotal?: number;
  iconFill?: string;
  index?: number;
  active?: number;
  inactive?: number;
}

export async function EffectiveStatCard({
  className,
  ...props
}: StatCardProps) {
  const {
    icon,
    title,
    active,
    inactive,
    total,
    female,

    male,
    iconFill,
    secondTotal,
  } = props;
  const { t } = await getServerTranslations();
  return (
    <div
      className={cn(
        "relative w-full rounded-lg border border-gray-300 p-2",
        className,
      )}
    >
      <div className="mb-2 flex items-start gap-5">
        <span
          className={cn(
            "bg-muted text-muted-foreground flex rounded-lg p-3",
            iconFill,
          )}
        >
          {icon}
        </span>
        <div>
          <p className="pb-1 font-medium text-gray-500">{title}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-700">
            <EffectiveStatCounter amount={total} duration={2} />
          </p>
        </div>
      </div>
      {female && male && (
        <div className="flex items-center gap-1.5">
          <div className={cn("flex items-center gap-1")}>
            <span
              className={cn(
                "bg-secondary text-secondary-foreground flex rounded-full px-2.5 py-1.5",
              )}
            >
              <PiGenderMale className="h-auto w-4" />
            </span>
            <span className="leading-none">
              {male.toLocaleString()} ({((male / total) * 100).toFixed(0)}%)
            </span>
          </div>
          <div className={cn("flex items-center gap-1")}>
            <span
              className={cn(
                "bg-secondary text-secondary-foreground flex rounded-full px-2.5 py-1.5",
              )}
            >
              <PiGenderFemale className="h-auto w-4" />
            </span>
            <span className="leading-none">
              {female.toLocaleString()} ({((female / total) * 100).toFixed(0)}
              %)
            </span>
          </div>
        </div>
      )}
      {secondTotal && (
        <div className="flex items-center gap-1">
          {t("total_contact_from_registered_students")}
          <span className="text-lg font-bold text-gray-900 dark:text-gray-700">
            <EffectiveStatCounter amount={secondTotal} duration={2} />
          </span>
        </div>
      )}
      {active != undefined && inactive != undefined && (
        <div className="flex items-center gap-4">
          <span>
            {t("active")}:<span className="font-semibold">{active}</span>
          </span>
          <span>
            {t("inactive")}: <span className="font-semibold">{inactive}</span>
          </span>
        </div>
      )}
    </div>
  );
}
