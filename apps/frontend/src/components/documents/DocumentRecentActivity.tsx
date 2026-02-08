"use client";

import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Edit3,
  FolderInput,
  MessageSquare,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { EmptyComponent } from "../EmptyComponent";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const actionStyles = {
  uploaded: {
    icon: Upload,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  shared: {
    icon: Share2,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  edited: {
    icon: Edit3,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  downloaded: {
    icon: Download,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
  moved: {
    icon: FolderInput,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
  },
  "commented on": {
    icon: MessageSquare,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  deleted: {
    icon: Trash2,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
};

// const fallbackStyle = {
//   icon: Upload,
//   iconColor: "text-emerald-500",
//   iconBg: "bg-emerald-500/10",
// };

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export function DocumentRecentActivity({
  entityId,
  entityType,
  limit = 10,
}: {
  entityId: string;
  entityType: "staff" | "student" | "contact";
  limit?: number;
}) {
  const trpc = useTRPC();
  const { data: activities, isPending } = useQuery(
    trpc.document.activities.queryOptions({
      entityId,
      entityType,
      limit,
    }),
  );
  const t = useTranslations();

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">{t("Recent Activities")}</h3>
        <Button variant={"link"} size={"sm"}>
          {t("View all")}
        </Button>
      </div>
      <div className="space-y-3">
        {isPending ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))
        ) : activities && activities.length > 0 ? (
          activities.map((activity) => {
            const style =
              actionStyles[activity.action as keyof typeof actionStyles];
            // fallbackStyle;
            const Icon = style.icon;
            const name =
              activity.user?.name ?? activity.user?.username ?? "Unknown";
            const user_initials = getInitials(name);

            const activityDate =
              activity.createdAt instanceof Date
                ? activity.createdAt
                : new Date(activity.createdAt);
            const data = activity.data as {
              filename?: string;
              title?: string;
            } | null;
            const filename = data?.filename ?? data?.title ?? "Document";

            const avatar = createAvatar(initials, {
              seed: activity.user?.username ?? name,
            });

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarImage
                    src={
                      activity.user?.image
                        ? `${activity.user.image}`
                        : avatar.toDataUri()
                    }
                  />
                  <AvatarFallback className="text-[10px]">
                    {user_initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{name}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {filename}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md",
                      style.iconBg,
                    )}
                  >
                    <Icon className={cn("size-3", style.iconColor)} />
                  </div>
                  <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                    {formatRelativeTime(activityDate)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyComponent
            title="Zero activité"
            description="Télécharger les documents"
          />
        )}
      </div>
    </div>
  );
}
