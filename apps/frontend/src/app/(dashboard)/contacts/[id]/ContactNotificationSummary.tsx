/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { PhoneCheckIcon, SmsCodeFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { NotificationChannel, NotificationSourceType } from "@repo/db/enums";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { useRouter } from "~/hooks/use-router";
import { ChatIcon, MailIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";

interface PreferenceRow {
  channel: NotificationChannel;
  sourceType: NotificationSourceType;
  enabled: boolean;
}

const channelIcons: Record<
  NotificationChannel,
  ComponentType<{ className?: string }>
> = {
  EMAIL: MailIcon,
  SMS: (props) => <HugeiconsIcon icon={SmsCodeFreeIcons} {...props} />,
  WHATSAPP: ChatIcon,
  IN_APP: (props) => (
    <HugeiconsIcon icon={PhoneCheckIcon} strokeWidth={2} {...props} />
  ),
};

const channelLabels: Record<NotificationChannel, string> = {
  EMAIL: "Email Notifications",
  SMS: "SMS Alerts",
  WHATSAPP: "WhatsApp Messages",
  IN_APP: "Push Notifications",
};

const sourceTypeLabels: Record<NotificationSourceType, string> = {
  GRADES_UPDATES: "Grades Updates",
  ABSENCE_ALERTS: "Absence Alerts",
  PAYMENT_REMINDERS: "Payment Reminders",
  EVENT_NOTIFICATIONS: "Event Notifications",
  WEEKLY_SUMMARIES: "Weekly Summaries",
};

const DEFAULT_ENABLED_CHANNELS = new Set<NotificationChannel>([
  NotificationChannel.EMAIL,
  NotificationChannel.IN_APP,
]);

export function ContactNotificationSummary({
  contactId,
}: {
  contactId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [overrides, setOverrides] = useState<
    Partial<Record<NotificationChannel, boolean>>
  >({});

  const { data } = useSuspenseQuery(
    trpc.notificationPreference.user.queryOptions({
      entityId: contactId,
      profile: "contact",
    }),
  );

  const upsertMutation = useMutation(
    trpc.notificationPreference.upsert.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const preferencesByChannel = useMemo(() => {
    const preferenceRows = data as PreferenceRow[];
    const types = Object.values(NotificationSourceType);
    const channels = Object.values(NotificationChannel);

    return channels.map((channel) => {
      let hasAnyPref = false;
      const enabledTypes = types.filter((type) => {
        const found = preferenceRows.find(
          (pref) => pref.channel === channel && pref.sourceType === type,
        );
        if (!found) return false;
        hasAnyPref = true;
        return found.enabled;
      });

      const override = overrides[channel];
      const defaultEnabled = DEFAULT_ENABLED_CHANNELS.has(channel);
      const effectiveEnabled =
        override ?? (hasAnyPref ? enabledTypes.length > 0 : defaultEnabled);

      const displayedTypes =
        override === undefined
          ? hasAnyPref
            ? enabledTypes
            : defaultEnabled
              ? types
              : []
          : override
            ? types
            : [];

      return {
        channel,
        enabled: effectiveEnabled,
        types: displayedTypes,
      };
    });
  }, [data, overrides]);

  const updateChannel = async (
    channel: NotificationChannel,
    enabled: boolean,
  ) => {
    setOverrides((prev) => ({ ...prev, [channel]: enabled }));
    const types = Object.values(NotificationSourceType);
    try {
      await Promise.all(
        types.map((sourceType) =>
          upsertMutation.mutateAsync({
            entityId: contactId,
            profile: "contact",
            sourceType,
            channel,
            enabled,
          }),
        ),
      );
      await queryClient.invalidateQueries(
        trpc.notificationPreference.user.pathFilter(),
      );
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[channel];
        return next;
      });
      toast.success("Notification preferences updated", { id: 0 });
    } catch {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[channel];
        return next;
      });
    }
  };
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-2">
      {preferencesByChannel.map((pref) => {
        const Icon = channelIcons[pref.channel];
        const label = channelLabels[pref.channel];

        return (
          <Card
            key={pref.channel}
            className={`rounded-lg border shadow-none ring-0 transition-colors ${
              pref.enabled
                ? "border-primary/20 bg-primary/5"
                : "border-border bg-secondary/30"
            }`}
          >
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2 ${
                      pref.enabled ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        pref.enabled ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{label}</p>
                    <p className="text-muted-foreground text-xs">
                      {pref.enabled ? "Active" : "Disabled"}
                    </p>
                  </div>
                </div>
              </CardTitle>
              {/* <CardDescription></CardDescription> */}
              <CardAction>
                <Switch
                  checked={pref.enabled}
                  onCheckedChange={async (checked) => {
                    await updateChannel(pref.channel, checked === true);
                  }}
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              {pref.enabled && pref.types.length > 0 && (
                <div className="border-border flex flex-wrap gap-1.5 border-t pt-3">
                  {pref.types.slice(0, 2).map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {sourceTypeLabels[type]}
                    </Badge>
                  ))}
                  <Button
                    onClick={() => {
                      router.push(`/contacts/${contactId}/notifications`);
                    }}
                    size={"xs"}
                    variant={"ghost"}
                  >
                    <MoreHorizontal />
                  </Button>
                </div>
              )}

              {!pref.enabled && (
                <p className="text-muted-foreground pt-2 text-xs">
                  Enable to configure notification types
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
