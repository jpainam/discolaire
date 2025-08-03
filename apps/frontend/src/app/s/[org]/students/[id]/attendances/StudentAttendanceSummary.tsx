"use client";

import type { VariantProps } from "class-variance-authority";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ListFilter,
  MessageSquare,
  UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import type { metricCardVariants } from "~/components/metric-card";
import { Badge } from "~/components/base-badge";
import {
  MetricCardButton,
  MetricCardGroup,
  MetricCardHeader,
  MetricCardSkeleton,
  MetricCardTitle,
  MetricCardValue,
} from "~/components/metric-card";
import { useTRPC } from "~/trpc/react";

export function StudentAttendanceSummary() {
  const trpc = useTRPC();
  const [termId] = useQueryState("termId");
  const params = useParams<{ id: string }>();
  const attendanceQuery = useQuery(
    trpc.attendance.studentSummary.queryOptions({
      studentId: params.id,
      termId: termId ?? undefined,
    }),
  );
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
  });
  const metrics = [
    {
      title: "absences",
      value: "12",
      variant: "destructive",
      status: "absence",
      justified: 5,
      icon: UserX,
    },
    {
      title: "chatter",
      value: "5",
      variant: "warning",
      status: "lateness",
      justified: 2,
      icon: Clock,
    },
    {
      title: "consigne",
      value: "3",
      variant: "success",
      status: "consigne",
      justified: 1,
      icon: FileText,
    },
    {
      title: "chatter",
      value: "8",
      variant: "primary",
      status: "chatter",
      justified: 4,
      icon: MessageSquare,
    },
    {
      title: "exclusion",
      value: "1",
      variant: "destructive",
      status: "exclusion",
      justified: 0,
      icon: AlertTriangle,
    },
  ];
  const t = useTranslations();
  return (
    <div className="px-4">
      <MetricCardGroup>
        {metrics.map((metric, index) => {
          const Icon = metric.status == status ? CheckCircle : ListFilter;
          return (
            <MetricCardButton
              key={index}
              variant={
                metric.variant as VariantProps<
                  typeof metricCardVariants
                >["variant"]
              }
              onClick={() => {
                void setStatus(metric.status);
              }}
            >
              <MetricCardHeader className="flex w-full items-center justify-between gap-2">
                <MetricCardTitle className="truncate">
                  {t(metric.title)}
                </MetricCardTitle>
                <Icon className="size-4" />
              </MetricCardHeader>

              {attendanceQuery.isPending ? (
                <MetricCardValue className="flex items-center justify-between">
                  {metric.value}
                  {metric.justified && (
                    <Badge
                      variant="secondary"
                      appearance={"light"}
                      className="ml-2"
                    >
                      {metric.justified} {t("justified")}
                    </Badge>
                  )}
                </MetricCardValue>
              ) : (
                <MetricCardSkeleton className="h-6 w-12" />
              )}
            </MetricCardButton>
          );
        })}
      </MetricCardGroup>
    </div>
  );
}
