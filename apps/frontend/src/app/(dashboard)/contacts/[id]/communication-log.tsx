"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCheck,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Reply,
  Smartphone,
  Users,
} from "lucide-react";

import type { CommunicationLog as CommunicationLogType } from "./parent-data";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

interface CommunicationLogProps {
  communications: CommunicationLogType[];
}

const typeIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  meeting: Users,
  app: Smartphone,
};

const statusConfig = {
  sent: { icon: Clock, label: "Sent", color: "text-muted-foreground" },
  delivered: { icon: Check, label: "Delivered", color: "text-chart-4" },
  read: { icon: CheckCheck, label: "Read", color: "text-primary" },
  replied: { icon: Reply, label: "Replied", color: "text-success" },
};

export function CommunicationLog({ communications }: CommunicationLogProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="text-primary h-5 w-5" />
            Communication History
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-3">
            {communications.map((comm) => {
              const TypeIcon = typeIcons[comm.type];
              const status = statusConfig[comm.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={comm.id}
                  className="border-border hover:bg-secondary/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors"
                >
                  <div className="relative">
                    <div className="bg-secondary rounded-lg p-2">
                      <TypeIcon className="text-muted-foreground h-4 w-4" />
                    </div>
                    {comm.direction === "inbound" ? (
                      <ArrowDownLeft className="text-success bg-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full" />
                    ) : (
                      <ArrowUpRight className="text-primary bg-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">
                          {comm.subject}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {new Date(comm.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`gap-1 text-xs ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {comm.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          comm.direction === "inbound"
                            ? "text-success"
                            : "text-primary"
                        }`}
                      >
                        {comm.direction === "inbound" ? "Received" : "Sent"}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="border-border mt-4 flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 bg-transparent"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 bg-transparent"
          >
            <MessageSquare className="h-4 w-4" />
            SMS
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 bg-transparent"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
