"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { BellIcon, Loader2, TriangleAlert } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

const initialNotifications = [
  {
    id: 1,
    user: "Chris Tompson",
    action: "requested review on",
    target: "PR #42: Feature implementation",
    timestamp: "15 minutes ago",
    unread: true,
  },
  {
    id: 2,
    user: "Emma Davis",
    action: "shared",
    target: "New component library",
    timestamp: "45 minutes ago",
    unread: true,
  },
  {
    id: 3,
    user: "James Wilson",
    action: "assigned you to",
    target: "API integration task",
    timestamp: "4 hours ago",
    unread: false,
  },
  {
    id: 4,
    user: "Alex Morgan",
    action: "replied to your comment in",
    target: "Authentication flow",
    timestamp: "12 hours ago",
    unread: false,
  },
  {
    id: 5,
    user: "Sarah Chen",
    action: "commented on",
    target: "Dashboard redesign",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: 6,
    user: "Miky Derya",
    action: "mentioned you in",
    target: "Origin UI open graph image",
    timestamp: "2 weeks ago",
    unread: false,
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export default function NotificationMenu({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const notificationQuery = useQuery(
    trpc.userNotification.user.queryOptions({ userId }),
  );
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const { t } = useLocale();

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="Open notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
            // <div
            //   aria-hidden="true"
            //   className="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
            // />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-1">
        {notificationQuery.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : notificationQuery.data?.length == 0 ? (
          <div className="text-muted-foreground flex h-20 items-center justify-center gap-1 text-sm">
            <TriangleAlert className="h-4 w-4" />
            {t("No notifications")}
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between gap-4 px-3 py-2">
              <div className="text-sm font-semibold">{t("Notifications")}</div>
              {unreadCount > 0 && (
                <button
                  className="text-xs font-medium hover:underline"
                  onClick={handleMarkAllAsRead}
                >
                  {t("Mark all as read")}
                </button>
              )}
            </div>
            <div
              role="separator"
              aria-orientation="horizontal"
              className="bg-border -mx-1 my-1 h-px"
            ></div>
            {notificationQuery.data?.map((notification) => (
              <div
                key={notification.id}
                className="hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors"
              >
                <div className="relative flex items-start pe-3">
                  <div className="flex-1 space-y-1">
                    <button
                      className="text-foreground/80 text-left after:absolute after:inset-0"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <span className="text-foreground font-medium hover:underline">
                        {notification.title}
                      </span>{" "}
                      {/* {notification.action}{" "} */}
                      <span className="text-foreground font-medium hover:underline">
                        {notification.message}
                      </span>
                      .
                    </button>
                    <div className="text-muted-foreground text-xs">
                      {formatDistanceToNow(notification.createdAt, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute end-0 self-center">
                      <span className="sr-only">Unread</span>
                      <Dot />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
