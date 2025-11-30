import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { Badge } from "~/components/base-badge";
import { getQueryClient, trpc } from "~/trpc/server";

export async function AttendanceStats() {
  const t = await getTranslations();
  const queryClient = getQueryClient();
  const count = await queryClient.fetchQuery(
    trpc.attendance.count.queryOptions({}),
  );
  const prevSchoolYear = await queryClient.fetchQuery(
    trpc.schoolYear.getPrevious.queryOptions(),
  );
  const prevCount = await queryClient.fetchQuery(
    trpc.attendance.count.queryOptions({ schoolYearId: prevSchoolYear.id }),
  );
  const locale = await getLocale();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Card>
        <CardHeader>
          <CardTitle>
            {count.absence.toLocaleString(locale)} {t("absences")}
          </CardTitle>
          <CardDescription>
            {prevCount.absence.toLocaleString(locale)} comparé à l'année
            dernière
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge
            variant={
              prevCount.absence < count.absence ? "destructive" : "success"
            }
            appearance="outline"
          >
            {prevCount.absence < count.absence ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )}
            {count.absence == 0
              ? 0
              : (
                  (Math.abs(prevCount.absence - count.absence) /
                    count.absence) *
                  100
                ).toFixed(2)}
          </Badge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {count.late.toLocaleString(locale)} {t("late")}
          </CardTitle>
          <CardDescription>
            {prevCount.late} comparé à l'année dernière
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge
            variant={prevCount.late < count.late ? "destructive" : "success"}
            appearance="outline"
          >
            {prevCount.late < count.late ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )}
            {count.late == 0
              ? 0
              : (
                  (Math.abs(prevCount.late - count.late) / count.late) *
                  100
                ).toFixed(2)}
          </Badge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {count.exclusion} {t("exclusions")}
          </CardTitle>
          <CardDescription>
            {prevCount.exclusion} comparé à l'année dernière
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge
            variant={
              prevCount.exclusion < count.exclusion ? "destructive" : "success"
            }
            appearance="outline"
          >
            {prevCount.exclusion < count.exclusion ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )}
            {count.exclusion == 0
              ? 0
              : (
                  (Math.abs(prevCount.exclusion - count.exclusion) /
                    count.exclusion) *
                  100
                ).toFixed(2)}
          </Badge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {count.consigne} {t("consigne")}
          </CardTitle>
          <CardDescription>
            {prevCount.consigne} comparé à l'année dernière
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge
            variant={
              prevCount.consigne < count.consigne ? "destructive" : "success"
            }
            appearance="outline"
          >
            {prevCount.consigne < count.consigne ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )}
            {count.consigne == 0
              ? 0
              : (
                  (Math.abs(prevCount.consigne - count.consigne) /
                    count.consigne) *
                  100
                ).toFixed(2)}
          </Badge>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {count.chatter} {t("chatter")}
          </CardTitle>
          <CardDescription>
            {prevCount.chatter} comparé à l'année dernière
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge
            variant={
              prevCount.chatter < count.chatter ? "destructive" : "success"
            }
            appearance="outline"
          >
            {prevCount.chatter < count.chatter ? (
              <TrendingUpIcon />
            ) : (
              <TrendingDownIcon />
            )}
            {count.chatter == 0
              ? 0
              : (
                  (Math.abs(prevCount.chatter - count.chatter) /
                    count.chatter) *
                  100
                ).toFixed(2)}
          </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
