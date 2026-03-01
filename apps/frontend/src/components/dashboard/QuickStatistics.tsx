"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Card } from "~/components/ui/card";
import { ContactIcon, GroupsIcon, HomeIcon, UsersIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

const colorMap = {
  primary:
    "bg-[var(--color-primary-soft,var(--color-blue-50))] text-[var(--color-primary-accent,var(--color-blue-700))] dark:bg-[var(--color-primary-soft,var(--color-blue-950))] dark:text-[var(--color-primary-soft,var(--color-blue-600))]",
  accent:
    "bg-[var(--color-info-soft,var(--color-violet-100))] text-[var(--color-info-accent,var(--color-violet-700))] dark:bg-[var(--color-info-soft,var(--color-violet-950))] dark:text-[var(--color-info-soft,var(--color-violet-400))]",
  success:
    "bg-[var(--color-success-soft,var(--color-green-100))] text-[var(--color-success-accent,var(--color-green-800))] dark:bg-[var(--color-success-soft,var(--color-green-950))] dark:text-[var(--color-success-soft,var(--color-green-600))]",
  warning:
    "bg-[var(--color-warning-soft,var(--color-yellow-100))] text-[var(--color-warning-accent,var(--color-yellow-700))] dark:bg-[var(--color-warning-soft,var(--color-yellow-950))] dark:text-[var(--color-warning-soft,var(--color-yellow-600))]",
};

export function QuickStatistics() {
  const trpc = useTRPC();
  const { data: enrolled } = useSuspenseQuery(
    trpc.enrollment.count.queryOptions({}),
  );
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );
  const { data: staffCount } = useSuspenseQuery(
    trpc.staff.count.queryOptions(),
  );
  const t = useTranslations();

  const stats = [
    {
      label: t("total_students"),
      icon: <UsersIcon className="size-5" />,
      value: enrolled.total.toLocaleString(),
      color: "primary" as const,
    },
    {
      label: t("total_staffs"),
      icon: <GroupsIcon className="size-5" />,
      value: staffCount.total.toLocaleString(),
      color: "accent" as const,
    },
    {
      label: t("total_classrooms"),
      icon: <HomeIcon className="size-5" />,
      value: classrooms.length.toLocaleString(),
      color: "success" as const,
    },
    {
      label: t("total_contacts"),
      icon: <ContactIcon className="size-5" />,
      value: enrolled.contactCount.toLocaleString(),
      color: "warning" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="flex-row items-center justify-between gap-4 px-4 transition-shadow hover:shadow-md"
        >
          <div className="min-w-0">
            <p className="text-muted-foreground truncate text-xs font-medium">
              {stat.label}
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
              {stat.value}
            </p>
          </div>
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              colorMap[stat.color],
            )}
          >
            {stat.icon}
          </div>
        </Card>
      ))}
    </div>
  );
}
