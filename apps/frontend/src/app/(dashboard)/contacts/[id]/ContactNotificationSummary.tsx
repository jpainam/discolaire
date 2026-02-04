"use client";

import { Mail, MessageCircle, MessageSquare, Smartphone } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { parentData } from "./parent-data";

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
  whatsapp: MessageCircle,
};

const channelLabels = {
  email: "Email Notifications",
  sms: "SMS Alerts",
  push: "Push Notifications",
  whatsapp: "WhatsApp Messages",
};

export function ContactNotificationSummary() {
  const preferences = parentData.notificationPreferences;
  return (
    <div className="grid grid-cols-2 gap-2">
      {preferences.map((pref) => {
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
                <Switch checked={pref.enabled} />
              </CardAction>
            </CardHeader>
            <CardContent>
              {pref.enabled && pref.types.length > 0 && (
                <div className="border-border flex flex-wrap gap-1.5 border-t pt-3">
                  {pref.types.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {type}
                    </Badge>
                  ))}
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
