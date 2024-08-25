"use client";

import { ScrollArea } from "@repo/ui/scroll-area";

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

function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function InboxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function StarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
