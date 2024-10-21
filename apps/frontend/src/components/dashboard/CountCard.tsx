import type { LucideIcon } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

import { cn } from "~/lib/utils";

export async function CountCard({
  icon,
  title,
  count,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  percentage,
  className,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  description?: string;
  percentage: number;
  className?: string;
}) {
  const Icon = icon;
  const { i18n, t } = await getServerTranslations();
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {count.toLocaleString(i18n.language)}
        </div>
        <p className="text-xs text-muted-foreground">
          {percentage.toFixed(0) + t("percent_from_last_month")}
        </p>
      </CardContent>
    </Card>
  );
}
