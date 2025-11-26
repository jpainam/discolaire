"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ContactRoundIcon,
  HouseIcon,
  SquareUserIcon,
  UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useTRPC } from "~/trpc/react";

export function QuickStatistics() {
  const trpc = useTRPC();
  const { data: enrolled } = useSuspenseQuery(
    trpc.enrollment.count.queryOptions({}),
  );
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );
  const { data: contactCount } = useSuspenseQuery(
    trpc.contact.count.queryOptions(),
  );

  const { data: staffCount } = useSuspenseQuery(
    trpc.staff.count.queryOptions(),
  );
  const t = useTranslations();
  const stats = [
    {
      title: t("total_students"),
      icon: UserRound,
      value: enrolled.total,
      delta: (enrolled.new / (enrolled.total || 1e9)) * 100,
      lastMonth: enrolled.totalLastYear,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_staffs"),
      icon: SquareUserIcon,
      value: staffCount.total,
      delta: 0,
      lastMonth: staffCount.total,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_classrooms"),
      value: classrooms.length,
      delta: 0,
      icon: HouseIcon,
      lastMonth: classrooms.length,
      positive: true,
      prefix: "",
      suffix: "",
    },
    {
      title: t("total_contacts"),
      icon: ContactRoundIcon,
      value: enrolled.contactCount,
      delta: (contactCount.new / (contactCount.total || 1e9)) * 100,
      lastMonth: contactCount.total,
      positive: true,
      prefix: "",
      suffix: "",
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((st, index) => {
        const Icon = st.icon;
        return (
          <div
            key={index}
            className="border-border bg-card relative overflow-hidden rounded-xl border p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">{st.title}</p>
                <p className="text-foreground text-2xl font-medium">
                  {st.value.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted border-border flex size-16 items-center justify-center rounded-lg border">
                <Icon className="text-muted-foreground size-8" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
