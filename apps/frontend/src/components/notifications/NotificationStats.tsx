"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  SkipForward,
  XCircle,
} from "lucide-react";

import { Card } from "~/components/ui/card";
import { useTRPC } from "~/trpc/react";

export function NotificationStatsCards({
  recipientId,
  profile,
}: {
  recipientId: string;
  profile: "staff" | "student" | "contact";
}) {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(
    trpc.notification.stats.queryOptions({
      recipientId,
      recipientProfile: profile,
    }),
  );
  const statItems = useMemo(() => {
    return [
      {
        label: "Total Notifications",
        value: stats.total,
        icon: Bell,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
      },
      {
        label: "Sent",
        value: stats.sent,
        icon: CheckCircle,
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
      },
      {
        label: "Failed",
        value: stats.failed,
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-400/10",
      },
      {
        label: "Pending",
        value: stats.pending,
        icon: Clock,
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
      },
      {
        label: "Skipped",
        value: stats.skipped,
        icon: SkipForward,
        color: "text-gray-400",
        bgColor: "bg-gray-400/10",
      },
      {
        label: "SMS Credits Used",
        value: stats.smsCreditsUsed,
        icon: MessageSquare,
        color: "text-cyan-400",
        bgColor: "bg-cyan-400/10",
      },
      {
        label: "WhatsApp Credits Used",
        value: stats.whatsappCreditsUsed,
        icon: Send,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
      },
    ];
  }, [stats]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
      {statItems.map((item) => (
        <Card
          key={item.label}
          className="border-border bg-card hover:bg-accent p-4 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${item.bgColor}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground truncate text-xs">
                {item.label}
              </p>
              <p className="text-foreground text-xl font-semibold">
                {item.value.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
