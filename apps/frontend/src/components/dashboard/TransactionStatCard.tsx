/**
 * v0 by Vercel.
 * @see https://v0.dev/t/AotrKkWo9MB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { getServerTranslations } from "@/app/i18n/server";
import { CURRENCY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";

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
    <div className={cn("relative w-full rounded-lg p-0 border", className)}>
      <div className="absolute inset-0 flex items-center justify-end">
        {icon}
      </div>
      <div className=" px-4 py-5 relative z-10 space-y-2 ">
        <h3 className="text-2xl font-extrabold">
          {title.toLocaleString()} {CURRENCY}
        </h3>
        <p className="dark:text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        href="#"
        className="w-full  gap-2 flex flex-row text-sm justify-center items-center rounded-b-lg px-4 bg-gray-800/20"
      >
        {t("more_info")} <CircleArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
