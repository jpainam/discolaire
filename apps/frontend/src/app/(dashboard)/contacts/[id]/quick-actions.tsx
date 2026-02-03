"use client";

import {
  Calendar,
  Download,
  FileText,
  History,
  Mail,
  MessageSquare,
  Phone,
  UserCog,
  Video,
  Zap,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function QuickActions() {
  const actions = [
    { icon: Mail, label: "Send Email", color: "text-primary" },
    { icon: MessageSquare, label: "Send SMS", color: "text-chart-3" },
    { icon: Phone, label: "Call Now", color: "text-success" },
    { icon: Video, label: "Video Call", color: "text-accent" },
    { icon: Calendar, label: "Schedule Meeting", color: "text-chart-4" },
    { icon: FileText, label: "Generate Report", color: "text-chart-5" },
    { icon: UserCog, label: "Edit Profile", color: "text-muted-foreground" },
    { icon: History, label: "View Activity", color: "text-primary" },
    { icon: Download, label: "Export Data", color: "text-chart-3" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <Zap className="text-primary h-4 w-4" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="hover:bg-secondary/50 flex h-auto flex-col items-center gap-2 bg-transparent py-4"
            >
              <action.icon className={`h-5 w-5 ${action.color}`} />
              <span className="text-center text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
