import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";

import { getServerTranslations } from "~/i18n/server";
import { cn } from "~/lib/utils";

interface StatisticProps {
  title: string;
  total: number;
  justified: number;
}

async function StatisticCard({ title, total, justified }: StatisticProps) {
  const justifiedPercentage = total > 0 ? (justified / total) * 100 : 0;
  const { t } = await getServerTranslations();
  return (
    <Card
      //   style={{
      //     borderLeftColor: "#00FEFF",
      //   }}
      className="hover:bg-secondary rounded-md"
    >
      <CardHeader className="px-2 py-0">
        <CardTitle className="text-md font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-muted-foreground text-sm">
            {justified} {t("justified")}
          </span>
        </div>
        <Progress
          value={justifiedPercentage}
          className="h-2"
          //   indicatorColor={
          //     justifiedPercentage > 50 ? "bg-green-500" : "bg-yellow-500"
          //   }
        />
        <p className="text-muted-foreground mt-1 text-right text-xs">
          {justifiedPercentage.toFixed(1)}% {t("justified")}
        </p>
      </CardContent>
    </Card>
  );
}

export async function AttendanceStatistics({
  className,
}: {
  className?: string;
}) {
  const { t } = await getServerTranslations();
  const statistics: StatisticProps[] = [
    { title: t("absence"), total: 4, justified: 2 },
    { title: t("lateness"), total: 7, justified: 3 },
    { title: t("chatter"), total: 12, justified: 0 },
    { title: t("consigne"), total: 2, justified: 1 },
    { title: t("exclusion"), total: 1, justified: 0 },
    { title: t("others"), total: 5, justified: 2 },
  ];

  return (
    <div
      className={cn("grid gap-4 p-2 md:grid-cols-2 lg:grid-cols-2", className)}
    >
      {statistics.map((stat) => (
        <StatisticCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
