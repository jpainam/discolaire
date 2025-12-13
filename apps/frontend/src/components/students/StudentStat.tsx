"use client";

import type { LucideIcon } from "lucide-react";
import { LogOut, User, UserMinus, Users, UserX } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export function StudentStat() {
  return (
    <div className="my-2 flex w-full flex-col">
      <div className="flex flex-row items-center gap-4 px-4">
        <span className="mr-4 text-3xl font-bold">Students</span>
        <span>How to get started</span>
        <span>Watch a video</span>
        <span> Join a webinar</span>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-6 gap-4 divide-x">
        <StudentStatCard
          className="bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-700/10 dark:text-green-50"
          n={1}
          title="Active"
        />
        <StudentStatCard
          className="bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-50"
          n={0}
          title="Signed in"
        />
        <StudentStatCard
          icon={LogOut}
          n={1}
          className="dark:ring-red-60/10 bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-700/10 dark:text-red-50"
          title="Signed out"
        />
        <StudentStatCard
          className="bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-400/10 dark:text-pink-50"
          icon={UserMinus}
          n={0}
          title="Absent"
        />
        <StudentStatCard
          className="bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-700/10 dark:text-purple-50"
          n={0}
          icon={Users}
          title="Total"
        />
        <StudentStatCard
          className="bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-700/10 dark:text-gray-50"
          icon={UserX}
          n={0}
          title="Inactive"
        />
      </div>
      <Separator />
    </div>
  );
}

function StudentStatCard({
  n,
  className,
  title,
  icon,
}: {
  n: number;
  icon?: LucideIcon;
  className?: string;
  title: string;
}) {
  const Icon = icon ?? User;
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          className,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-sm font-bold">{n}</span>
      <span
        className={cn(
          "bg-secondary text-secondary-foreground my-1 rounded-lg px-2 py-1 text-sm",
          className,
        )}
      >
        {title}
      </span>
    </div>
  );
}
