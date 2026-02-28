"use client";

import { useMemo, useState } from "react";

import type { EmailTemplate } from "./email-data";
import { EMAIL_TEMPLATES } from "./email-data";

export function StatsBar() {
  const [templates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES);
  const stats = useMemo(() => {
    const active = templates.filter((t) => t.enabled);
    return {
      total: templates.length,
      activeCount: active.length,
      staffEnabled: active.filter((t) => t.staff).length,
      studentEnabled: active.filter((t) => t.student).length,
      contactEnabled: active.filter((t) => t.contact).length,
    };
  }, [templates]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
