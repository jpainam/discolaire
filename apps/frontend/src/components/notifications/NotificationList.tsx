"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Clock, Loader2, TriangleAlert, XIcon } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { authClient } from "~/auth/client";
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
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { NotificationIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { EmptyComponent } from "../EmptyComponent";

type UserNotification = RouterOutputs["userNotification"]["user"][number];

function NotificationItem({
  notification,
  onMarkAsRead,
  isMutating,
}: {
  notification: UserNotification;
  onMarkAsRead?: (id: string) => void;
  isMutating: boolean;
}) {
  const isRead = notification.read;

  return (
    <div
      className={cn(
        "bg-muted/50 hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors",
        !isRead && "bg-blue-50/50",
      )}
    >
      <div
        className={cn(
          "mt-1 h-2 w-2 flex-shrink-0 rounded-full",
          !isRead ? "bg-blue-500" : "bg-transparent",
        )}
      />
      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "line-clamp-1 overflow-hidden text-sm font-medium",
              !isRead ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {notification.title}
          </p>
          <span className="text-muted-foreground flex w-[80px] items-center justify-end gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </span>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-xs">
          {notification.message}
        </p>
        {!isRead && onMarkAsRead && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            onClick={() => {
              onMarkAsRead(notification.id);
            }}
            disabled={isMutating}
          >
            Mark as read
          </Button>
        )}
      </div>
    </div>
  );
}

export function NotificationList({ className }: { className?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const userId = session?.user.id;
  const notificationQuery = useQuery({
    ...trpc.userNotification.user.queryOptions({
      userId: userId ?? "",
      limit: 50,
    }),
    enabled: !!userId,
  });

  const markAsReadMutation = useMutation(
    trpc.userNotification.udpateRead.mutationOptions(),
  );

  const sortedNotifications = useMemo(() => {
    return [...(notificationQuery.data ?? [])].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }, [notificationQuery.data]);

  const unreadNotifications = useMemo(
    () => sortedNotifications.filter((notification) => !notification.read),
    [sortedNotifications],
  );
  const readNotifications = useMemo(
    () => sortedNotifications.filter((notification) => notification.read),
    [sortedNotifications],
  );
  const unreadCount = unreadNotifications.length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync({ id, read: true });
      await queryClient.invalidateQueries(
        trpc.userNotification.user.pathFilter(),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed", {
        id: 0,
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadNotifications.length === 0) {
      return;
    }
    try {
      await Promise.all(
        unreadNotifications.map((notification) =>
          markAsReadMutation.mutateAsync({
            id: notification.id,
            read: true,
          }),
        ),
      );
      await queryClient.invalidateQueries(
        trpc.userNotification.user.pathFilter(),
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed", {
        id: 0,
      });
    }
  };

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
              {isSessionPending || notificationQuery.isPending
                ? "Loading notifications..."
                : unreadCount > 0
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
                  {isSessionPending || notificationQuery.isPending ? (
                    <div className="flex h-32 items-center justify-center">
                      <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                    </div>
                  ) : notificationQuery.isError ? (
                    <div className="text-muted-foreground flex h-32 items-center justify-center gap-2 text-sm">
                      <TriangleAlert className="h-4 w-4" />
                      {notificationQuery.error.message}
                    </div>
                  ) : unreadNotifications.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-end px-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => {
                            void handleMarkAllAsRead();
                          }}
                          disabled={markAsReadMutation.isPending}
                        >
                          Mark all as read
                        </Button>
                      </div>
                      {unreadNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          isMutating={markAsReadMutation.isPending}
                          onMarkAsRead={(id) => {
                            void handleMarkAsRead(id);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyComponent
                      title="No unread notifications"
                      description="Notifications will show here if you have any"
                    />
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="read" className="m-0 min-h-0 flex-1">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  {isSessionPending || notificationQuery.isPending ? (
                    <div className="flex h-32 items-center justify-center">
                      <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                    </div>
                  ) : readNotifications.length > 0 ? (
                    <div className="space-y-2">
                      {readNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          isMutating={markAsReadMutation.isPending}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyComponent
                      title="No read notifications"
                      description="Read notifications will be shown here"
                    />
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="mt-auto">
            <Button
              variant="link"
              className="w-full text-xs"
              disabled={!userId}
              onClick={() => {
                if (!userId) {
                  return;
                }
                setOpen(false);
                router.push(routes.users.notifications(userId));
              }}
            >
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
