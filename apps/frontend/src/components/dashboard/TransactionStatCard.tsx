/**
 * v0 by Vercel.
 * @see https://v0.dev/t/AotrKkWo9MB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

import { getServerTranslations } from "~/i18n/server";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";

export async function TransactionStatCard({
  title,
  subtitle,
  className,
  icon,
}: {
  title: number;
  subtitle: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  const { t } = await getServerTranslations();
  return (
    <div className={cn("relative w-full rounded-lg border p-0", className)}>
      <div className="absolute inset-0 flex items-center justify-end">
        {icon}
      </div>
      <div className="relative z-10 space-y-2 px-4 py-5">
        <h3 className="text-2xl font-extrabold">
          {title.toLocaleString()} {CURRENCY}
        </h3>
        <p className="dark:text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        href="#"
        className="flex w-full flex-row items-center justify-center gap-2 rounded-b-lg bg-gray-800/20 px-4 text-sm"
      >
        {t("more_info")} <CircleArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
