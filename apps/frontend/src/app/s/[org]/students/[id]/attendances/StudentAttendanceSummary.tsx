"use client";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

const attendanceToIcon: Record<string, LucideIcon> = {
  absence: UserX,
  lateness: Clock,
  consigne: FileText,
  chatter: MessageSquare,
  exclusion: AlertTriangle,
};

const defaultMetrics = [
  {
    title: "absences",
    value: "0",
    variant: "destructive",
    status: "absence",
    justified: 0,
    icon: UserX,
  },
  {
    title: "lateness",
    value: "0",
    variant: "warning",
    status: "lateness",
    justified: 0,
    icon: Clock,
  },
  {
    title: "consigne",
    value: "0",
    variant: "success",
    status: "consigne",
    justified: 0,
    icon: FileText,
  },
  {
    title: "chatter",
    value: "0",
    variant: "primary",
    status: "chatter",
    justified: 0,
    icon: MessageSquare,
  },
  {
    title: "exclusion",
    value: "0",
    variant: "destructive",
    status: "exclusion",
    justified: 0,
    icon: AlertTriangle,
  },
];

export function StudentAttendanceSummary() {
  const trpc = useTRPC();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const [metrics, setMetrics] = useState<
    {
      title: string;
      value: string;
      variant: string;
      status: string;
      justified: number;
      icon: LucideIcon;
    }[]
  >(defaultMetrics);
  const attendanceQuery = useQuery(
    trpc.attendance.studentSummary.queryOptions({
      studentId: params.id,
      termId: searchParams.get("termId") ?? undefined,
    }),
  );
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
  });

  useEffect(() => {
    const v = attendanceQuery.data ?? [];
    const d = v.map((item) => {
      return {
        title: item.type,
        value: item.value.toString(),
        variant:
          item.type === "absence"
            ? "destructive"
            : item.type === "lateness"
              ? "warning"
              : item.type === "consigne"
                ? "success"
                : item.type === "chatter"
                  ? "primary"
                  : "destructive",
        status: item.type.toLowerCase(),
        justified: item.justified,
        icon: attendanceToIcon[item.type] ?? UserX,
      };
    });

    setMetrics(d);
  }, [attendanceQuery.data]);

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

              {!attendanceQuery.isPending ? (
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
