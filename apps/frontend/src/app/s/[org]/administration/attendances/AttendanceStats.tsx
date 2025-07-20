import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import FlatBadge from "~/components/FlatBadge";
import { getServerTranslations } from "~/i18n/server";

export async function AttendanceStats() {
  const { t } = await getServerTranslations();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("total_absences")}</CardTitle>
          <CardDescription>+150 depuis les 30jrs</CardDescription>
        </CardHeader>
        <CardFooter>
          {/* <Badge variant="outline">
            <TrendingUpIcon />
            +12.5%
          </Badge> */}
          <FlatBadge className="gap-2" variant="green">
            <TrendingUpIcon className="h-4 w-4" />
            +12.5%
          </FlatBadge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("all_lates")}</CardTitle>
          <CardDescription>-12 depuis le mois dernier</CardDescription>
        </CardHeader>
        <CardFooter>
          <FlatBadge className="gap-2" variant="indigo">
            <TrendingDownIcon className="h-4 w-4" />
            -20%
          </FlatBadge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("all_exclusions")}</CardTitle>
          <CardDescription>+2 depuis le mois dernier</CardDescription>
        </CardHeader>
        <CardFooter>
          <FlatBadge className="gap-2" variant="pink">
            <TrendingUpIcon className="h-4 w-4" />
            +12.5%
          </FlatBadge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("all_consignes")}</CardTitle>
          <CardDescription>+12 depuis le mois dernier</CardDescription>
        </CardHeader>
        <CardFooter>
          <FlatBadge className="gap-2" variant="yellow">
            <TrendingUpIcon className="h-4 w-4" />
            +4.5%
          </FlatBadge>
        </CardFooter>
      </Card>
    </div>
  );
}
