"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function StatsBar() {
  const trpc = useTRPC();
  const { data: templates } = useSuspenseQuery(
    trpc.notificationConfig.list.queryOptions({ channel: "EMAIL" }),
  );

  const stats = useMemo(() => {
    const active = templates.filter((t) => t.enabled);
    return {
      total: templates.length,
      activeCount: active.length,
      staffEnabled: active.filter((t) => t.allowStaff).length,
      studentEnabled: active.filter((t) => t.allowStudent).length,
      contactEnabled: active.filter((t) => t.allowContact).length,
    };
  }, [templates]);

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-2 sm:grid-cols-5">
      {[
        { label: "Total Emails", value: stats.total, cls: "text-foreground" },
        { label: "Active", value: stats.activeCount, cls: "text-primary" },
        {
          label: "Staff Enabled",
          value: stats.staffEnabled,
          cls: "text-blue-600",
        },
        {
          label: "Students Enabled",
          value: stats.studentEnabled,
          cls: "text-violet-600",
        },
        {
          label: "Contacts Enabled",
          value: stats.contactEnabled,
          cls: "text-emerald-600",
        },
      ].map(({ label, value, cls }) => (
        <div
          key={label}
          className="bg-card border-border rounded-lg border px-4 py-3"
        >
          <p className="text-muted-foreground mb-0.5 text-xs">{label}</p>
          <p className={`text-2xl font-semibold ${cls}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
