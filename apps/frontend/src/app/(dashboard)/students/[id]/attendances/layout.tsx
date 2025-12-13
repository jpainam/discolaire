import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  AlertTriangle,
  Clock,
  FileText,
  ListFilter,
  MessageSquare,
  UserX,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { metricCardVariants } from "~/components/metric-card";
import { Badge } from "~/components/base-badge";
import { ErrorFallback } from "~/components/error-fallback";
import {
  MetricCardButton,
  MetricCardGroup,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardValue,
} from "~/components/metric-card";
import { StudentAttendanceHeader } from "~/components/students/attendances/StudentAttendanceHeader";
import { Skeleton } from "~/components/ui/skeleton";
import { getQueryClient, trpc } from "~/trpc/server";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const params = await props.params;
  const attendances = await getQueryClient().fetchQuery(
    trpc.attendance.student.queryOptions({
      studentId: params.id,
    }),
  );
  const t = await getTranslations();
  const sum = (a: number[]) => {
    return a.reduce((a, b) => a + b, 0);
  };
  const metrics = [
    {
      title: "absences",
      value: sum(attendances.map((a) => a.absence)),
      variant: "destructive",
      status: "absence",
      justified: sum(attendances.map((a) => a.justifiedAbsence)),
      icon: UserX,
    },
    {
      title: "late",
      value: sum(attendances.map((a) => a.late)),
      variant: "warning",
      status: "late",
      justified: sum(attendances.map((a) => a.justifiedLate)),
      icon: Clock,
    },
    {
      title: "consigne",
      value: sum(attendances.map((a) => a.consigne)),
      variant: "success",
      status: "consigne",
      justified: 0,
      icon: FileText,
    },
    {
      title: "chatter",
      value: sum(attendances.map((a) => a.chatter)),
      variant: "primary",
      status: "chatter",
      justified: 0,
      icon: MessageSquare,
    },
    {
      title: "exclusion",
      value: sum(attendances.map((a) => a.exclusion)),
      variant: "destructive",
      status: "exclusion",
      justified: 0,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="h-8 w-full" />}>
          <StudentAttendanceHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <div className="px-4">
          <MetricCardGroup>
            {metrics.map((metric, index) => {
              const Icon = ListFilter;
              return (
                <MetricCardButton
                  key={index}
                  variant={
                    metric.variant as VariantProps<
                      typeof metricCardVariants
                    >["variant"]
                  }
                >
                  <MetricCardHeader className="flex w-full items-center justify-between gap-2">
                    <MetricCardTitle className="truncate">
                      {t(metric.title)}
                    </MetricCardTitle>
                    <Icon className="size-4" />
                  </MetricCardHeader>

                  <MetricCardValue className="flex items-center justify-between">
                    <span>{metric.value}</span>
                    {metric.justified != 0 && (
                      <Badge
                        variant="secondary"
                        appearance={"light"}
                        className="ml-2"
                      >
                        {metric.justified} {t("justified")}
                      </Badge>
                    )}
                  </MetricCardValue>
                </MetricCardButton>
              );
            })}
          </MetricCardGroup>
        </div>
      </ErrorBoundary>

      {props.children}
    </div>
  );
}
