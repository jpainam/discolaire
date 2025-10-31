"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";

import type { NotificationType } from "~/configs/constants";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

interface NotificationEvent {
  id: NotificationType;
  name: string;
  description: string;
  icon?: string;
  channels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export function NotificationPreferences() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const upsertMutation = useMutation(
    trpc.notificationPreference.upsert.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.notificationPreference.user.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { data: preferences } = useSuspenseQuery(
    trpc.notificationPreference.user.queryOptions({ userId: params.id }),
  );
  const findPreferences = (
    event: string,
  ): { sms: boolean; email: boolean; whatsapp: boolean } => {
    const pref = preferences.find((pref) => pref.event === event);
    return {
      sms: pref?.channels.SMS ?? false,
      email: pref?.channels.EMAIL ?? false,
      whatsapp: pref?.channels.WHATSAPP ?? false,
    };
  };

  const [notificationEvents, setNotificationEvents] = useState<
    NotificationEvent[]
  >([
    {
      id: "grades_updates",
      icon: "📚",
      name: "Grades Updates",
      description: "Receive updates when new grades are available",
      channels: findPreferences("grades_updates"),
    },
    {
      id: "absence_alerts",
      icon: "🚨",
      name: "Absence Alerts",
      description: "Be notified if your child is absent",
      channels: findPreferences("absence_alerts"),
    },
    {
      id: "payment_reminders",
      icon: "💰",
      name: "Payment Reminders",
      description: "Upcoming tuition/payment due dates",
      channels: findPreferences("payment_reminders"),
    },
    {
      id: "event_notifications",
      icon: "📅",
      name: "Event Notifications",
      description: "School meetings, deadlines, or announcements",
      channels: findPreferences("event_notifications"),
    },
    {
      id: "weekly_summaries",
      icon: "📊",
      name: "Weekly Summaries",
      description: "Weekly academic summaries",
      channels: findPreferences("weekly_summaries"),
    },
  ]);

  const handleChannelChange = (
    eventId: string,
    channel: keyof NotificationEvent["channels"],
    value: boolean,
  ) => {
    setNotificationEvents(
      notificationEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            channels: {
              ...event.channels,
              [channel]: value,
            },
          };
        }
        return event;
      }),
    );
  };

  const handleSelectAll = (eventId: string, value: boolean) => {
    setNotificationEvents(
      notificationEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            channels: {
              email: value,
              sms: value,
              whatsapp: value,
            },
          };
        }
        return event;
      }),
    );
  };

  const handleSavePreferences = () => {
    // Here you would typically save the preferences to your backend
    console.log("Saved preferences:", notificationEvents);
    const notifications = notificationEvents.map((event) => ({
      event: event.id,
      channels: {
        SMS: event.channels.sms,
        EMAIL: event.channels.email,
        WHATSAPP: event.channels.whatsapp,
      },
    }));
    upsertMutation.mutate({ userId: params.id, notifications: notifications });
  };
  const { t } = useLocale();

  return (
    <div className="container max-w-3xl space-y-8 p-4">
      {notificationEvents.map((event) => (
        <div key={event.id} className="space-y-3">
          <div>
            <h3 className="text-md flex flex-row items-center gap-1 font-medium">
              <span>{event.icon}</span>
              <span> {t(event.name)}</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              {t(event.description)}
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[40%_15%_15%_15%]">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${event.id}-all`}
                checked={Object.values(event.channels).every(Boolean)}
                onCheckedChange={(checked) =>
                  handleSelectAll(event.id, checked === true)
                }
              />
              <Label htmlFor={`${event.id}-all`} className="font-medium">
                {t("All channels")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${event.id}-email`}
                checked={event.channels.email}
                onCheckedChange={(checked) =>
                  handleChannelChange(event.id, "email", checked === true)
                }
              />
              <Mail className="text-muted-foreground mr-1 h-4 w-4" />
              <Label htmlFor={`${event.id}-email`}>Email</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${event.id}-sms`}
                checked={event.channels.sms}
                onCheckedChange={(checked) =>
                  handleChannelChange(event.id, "sms", checked === true)
                }
              />
              <Phone className="text-muted-foreground mr-1 h-4 w-4" />
              <Label htmlFor={`${event.id}-sms`}>SMS</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${event.id}-whatsapp`}
                checked={event.channels.whatsapp}
                onCheckedChange={(checked) =>
                  handleChannelChange(event.id, "whatsapp", checked === true)
                }
              />
              <MessageSquare className="text-muted-foreground mr-1 h-4 w-4" />
              <Label htmlFor={`${event.id}-whatsapp`}>WhatsApp</Label>
            </div>
          </div>

          <Separator />
        </div>
      ))}

      <div className="flex">
        <Button
          isLoading={upsertMutation.isPending}
          size={"sm"}
          onClick={handleSavePreferences}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
