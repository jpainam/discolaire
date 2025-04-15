"use client";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export default function NotificationPreferences() {
  const [notificationEvents, setNotificationEvents] = useState<
    NotificationEvent[]
  >([
    {
      id: "account_updates",
      name: "Account Updates",
      description: "Get notified about important changes to your account",
      channels: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    },
    {
      id: "security_alerts",
      name: "Security Alerts",
      description:
        "Receive alerts about security issues and suspicious activities",
      channels: {
        email: true,
        sms: true,
        whatsapp: false,
      },
    },
    {
      id: "payment_reminders",
      name: "Payment Reminders",
      description: "Get reminders about upcoming and past due payments",
      channels: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    },
    {
      id: "new_features",
      name: "New Features",
      description: "Stay updated on new features and improvements",
      channels: {
        email: true,
        sms: false,
        whatsapp: false,
      },
    },
    {
      id: "marketing",
      name: "Marketing & Promotions",
      description: "Receive special offers and promotional content",
      channels: {
        email: false,
        sms: false,
        whatsapp: false,
      },
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
    alert("Preferences saved successfully!");
  };

  return (
    <div className="space-y-8 p-4 container max-w-3xl">
      {notificationEvents.map((event) => (
        <div key={event.id} className="space-y-3">
          <div>
            <h3 className="text-lg font-medium">{event.name}</h3>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[40%_15%_15%_15%] gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`${event.id}-all`}
                checked={Object.values(event.channels).every(Boolean)}
                onCheckedChange={(checked) =>
                  handleSelectAll(event.id, checked === true)
                }
              />
              <Label htmlFor={`${event.id}-all`} className="font-medium">
                All channels
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
              <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
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
              <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
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
              <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
              <Label htmlFor={`${event.id}-whatsapp`}>WhatsApp</Label>
            </div>
          </div>

          <Separator />
        </div>
      ))}

      <div className="flex ">
        <Button size={"sm"} onClick={handleSavePreferences}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
