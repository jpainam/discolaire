"use client";

import { BellIcon, CalendarIcon, InboxIcon, StarIcon } from "lucide-react";

import { ScrollArea } from "~/components/ui/scroll-area";

export default function NotificationList() {
  return (
    <ScrollArea className="h-[60vh] w-full px-2">
      <div>
        <p className="text-sm font-medium">Today</p>
        <div className="mt-2 space-y-3">
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md">
              <BellIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">New message from Jane</p>
                <p className="text-muted-foreground text-xs">10 minutes ago</p>
              </div>
              <p className="text-muted-foreground text-sm">
                Hey, just wanted to follow up on our meeting yesterday.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-accent text-accent-foreground flex h-10 w-10 items-center justify-center rounded-md">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">Upcoming meeting</p>
                <p className="text-muted-foreground text-xs">30 minutes ago</p>
              </div>
              <p className="text-muted-foreground text-sm">
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
            <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md">
              <InboxIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">New email from support</p>
                <p className="text-muted-foreground text-xs">
                  Yesterday at 5:34 PM
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Your support request has been received and is being processed.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-secondary text-secondary-foreground flex h-10 w-10 items-center justify-center rounded-md">
              <StarIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">New review</p>
                <p className="text-muted-foreground text-xs">
                  Yesterday at 2:41 PM
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                "Great product, highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
