import {
  Download,
  Edit3,
  FolderInput,
  MessageSquare,
  PlusCircle,
  RefreshCcw,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";

export const actionStyles = {
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
  updated: {
    icon: RefreshCcw,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  created: {
    icon: PlusCircle,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
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
} as const;
export type ActionType = keyof typeof actionStyles;
export function getActionStyle(action: string) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    actionStyles[action as ActionType] ?? {
      icon: Edit3,
      iconColor: "text-muted-foreground",
      iconBg: "bg-muted/10",
    }
  );
}

// Usage: const { icon: Icon, iconColor, iconBg } = getActionStyle(action);
