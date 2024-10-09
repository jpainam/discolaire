import type { LucideIcon } from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

export async function CountCard({
  icon,
  title,
  count,
  description,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  description: string;
}) {
  const Icon = icon;
  const { i18n } = await getServerTranslations();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {count.toLocaleString(i18n.language)}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
