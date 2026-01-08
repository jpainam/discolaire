/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, XIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { NotificationIcon } from "~/icons";
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
      className={`bg-muted/50 hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors ${!isRead ? "bg-blue-50/50" : ""}`}
    >
      <div
        className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!isRead ? "bg-blue-500" : "bg-transparent"}`}
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Link
            href=""
            className={`line-clamp-1 overflow-hidden text-sm font-medium hover:underline ${!isRead ? "text-foreground" : "text-muted-foreground"}`}
          >
            {notification.title}
          </Link>
          <span className="text-muted-foreground flex w-[80px] items-center justify-end gap-1 text-xs">
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
        <Button
          variant="ghost"
          size={"icon-xs"}
          className={cn("relative", className)}
        >
          <NotificationIcon />
          {unreadCount > 0 && (
            <Badge
              variant="ghost"
              className="absolute -top-0.5 -right-0.5 flex size-2 items-center justify-center bg-red-600 p-0 text-[7px]"
            ></Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mr-3 h-[calc(100vh-5rem)] w-80 p-0"
        align="start"
        sideOffset={10}
      >
        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle>Notification</CardTitle>
            <CardDescription>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notifications`
                : "All caught up!"}
            </CardDescription>
            <CardAction>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
                variant={"secondary"}
                size={"icon"}
              >
                <XIcon />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="min-h-0 flex-1 p-2">
            <Tabs defaultValue="unread">
              <TabsList className="w-full">
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

              <TabsContent value="unread" className="m-0 min-h-0 flex-1">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  {notifications.unread.length > 0 ? (
                    <div className="space-y-2">
                      {[
                        ...notifications.unread,
                        ...notifications.unread,
                        ...notifications.unread,
                        ...notifications.unread,
                      ].map((notification, index) => (
                        <NotificationItem
                          key={index}
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

              <TabsContent value="read" className="m-0 min-h-0 flex-1">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="space-y-2">
                    {notifications.read.map((notification, index) => (
                      <NotificationItem
                        key={index}
                        notification={notification}
                        isRead={true}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button variant="link" className="w-full text-xs">
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
