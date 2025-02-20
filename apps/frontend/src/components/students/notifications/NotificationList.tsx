"use client";

import { BellIcon, CalendarIcon, InboxIcon, StarIcon } from "lucide-react";

import { ScrollArea } from "@repo/ui/components/scroll-area";

export default function NotificationList() {
  return (
    <ScrollArea className="h-[60vh] w-full px-2">
      <div>
        <p className="text-sm font-medium">Today</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <BellIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">New message from Jane</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Hey, just wanted to follow up on our meeting yesterday.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Upcoming meeting</p>
                <p className="text-xs text-muted-foreground">30 minutes ago</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Team meeting at 2pm to discuss the new project.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">Yesterday</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <InboxIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">New email from support</p>
                <p className="text-xs text-muted-foreground">
                  Yesterday at 5:34 PM
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your support request has been received and is being processed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <StarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">New review</p>
                <p className="text-xs text-muted-foreground">
                  Yesterday at 2:41 PM
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                "Great product, highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
