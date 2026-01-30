"use client";

import {
  Download,
  Edit3,
  FolderInput,
  MessageSquare,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

const activities = [
  {
    id: "1",
    user: { name: "Leonel Ngoya", avatar: "leonel", initials: "LN" },
    action: "uploaded",
    file: "Dashboard Mockup.fig",
    time: "2 min ago",
    icon: Upload,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "2",
    user: { name: "Sarah Chen", avatar: "sarah", initials: "SC" },
    action: "shared",
    file: "Brand Guidelines.pdf",
    time: "15 min ago",
    icon: Share2,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    id: "3",
    user: { name: "Alex Kim", avatar: "alex", initials: "AK" },
    action: "edited",
    file: "UI Components.sketch",
    time: "1 hour ago",
    icon: Edit3,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    id: "4",
    user: { name: "Marie Dupont", avatar: "marie", initials: "MD" },
    action: "downloaded",
    file: "Product Demo.mp4",
    time: "3 hours ago",
    icon: Download,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
  {
    id: "5",
    user: { name: "James Wilson", avatar: "james", initials: "JW" },
    action: "moved",
    file: "Client Presentation.pptx",
    time: "5 hours ago",
    icon: FolderInput,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
  },
  {
    id: "6",
    user: { name: "Emma Taylor", avatar: "emma", initials: "ET" },
    action: "commented on",
    file: "App Icon.png",
    time: "Yesterday",
    icon: MessageSquare,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    id: "7",
    user: { name: "David Brown", avatar: "david", initials: "DB" },
    action: "deleted",
    file: "Old Backup.zip",
    time: "Yesterday",
    icon: Trash2,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
];

export function DocumentRecentActivity() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent Activity</h3>
        <button className="text-muted-foreground hover:text-foreground text-xs transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="size-8">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/glass/svg?seed=${activity.user.avatar}`}
              />
              <AvatarFallback className="text-[10px]">
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {activity.file}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={cn(
                  "flex size-6 items-center justify-center rounded-md",
                  activity.iconBg,
                )}
              >
                <activity.icon className={cn("size-3", activity.iconColor)} />
              </div>
              <span className="text-muted-foreground text-[10px] whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
