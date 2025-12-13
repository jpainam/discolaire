/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Bell, Check, Clock } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

// Sample notification data
const notifications = {
  unread: [
    {
      id: 1,
      title: "New deployment successful",
      message:
        "Your project 'my-app' has been deployed successfully to production.",
      date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      type: "success",
    },
    {
      id: 2,
      title: "Domain verification required",
      message:
        "Please verify your custom domain to complete the setup process.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "warning",
    },
    {
      id: 3,
      title: "Team invitation received",
      message: "You've been invited to join the 'Acme Corp' team workspace.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      type: "info",
    },
  ],
  read: [
    {
      id: 4,
      title: "Build completed",
      message: "Your latest build has completed successfully with no errors.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: "success",
    },
    {
      id: 5,
      title: "Usage alert",
      message: "You've reached 75% of your monthly bandwidth limit.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      type: "warning",
    },
    {
      id: 6,
      title: "Security update",
      message: "A security update has been applied to your account settings.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      type: "info",
    },
  ],
};

function formatDate(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}

function NotificationItem({
  notification,
  isRead,
}: {
  notification: any;
  isRead: boolean;
}) {
  return (
    <div
      className={`hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors ${!isRead ? "bg-blue-50/50" : ""}`}
    >
      <div
        className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!isRead ? "bg-blue-500" : "bg-transparent"}`}
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p
            className={`text-sm font-medium ${!isRead ? "text-foreground" : "text-muted-foreground"}`}
          >
            {notification.title}
          </p>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {formatDate(notification.date)}
          </span>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-xs">
          {notification.message}
        </p>
      </div>
    </div>
  );
}

export function NotificationList({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.unread.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notifications`
              : "All caught up!"}
          </p>
        </div>

        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="m-2 grid w-full grid-cols-2">
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-80">
              {notifications.unread.length > 0 ? (
                <div className="space-y-1 p-2">
                  {notifications.unread.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isRead={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center p-4 text-center">
                  <Check className="mb-2 h-8 w-8 text-green-500" />
                  <p className="text-muted-foreground text-sm">
                    No unread notifications
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="read" className="m-0">
            <ScrollArea className="h-80">
              <div className="space-y-1 p-2">
                {notifications.read.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isRead={true}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
