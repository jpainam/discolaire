"use client";

import {
  Bell,
  ChevronRight,
  FileText,
  GraduationCap,
  Inbox,
  LogOut,
  PenSquare,
  Send,
  Settings,
  Trash2,
  Users,
} from "lucide-react";

import type { Message } from "./mock-data";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface InboxSidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
  messages: Message[];
}

const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: FileText },
  { id: "trash", label: "Trash", icon: Trash2 },
];

export default function InboxSidebar({
  activeFolder,
  onFolderChange,
  onCompose,
  messages,
}: InboxSidebarProps) {
  const countUnread = (folder: string) =>
    messages.filter((m) => m.folder === folder && !m.read).length;

  return (
    <aside className="bg-sidebar text-sidebar-foreground flex h-full w-64 shrink-0 flex-col">
      {/* Brand */}
      <div className="border-sidebar-border flex items-center gap-3 border-b px-5 py-5">
        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
          <GraduationCap className="text-primary-foreground h-4 w-4" />
        </div>
        <div>
          <p className="text-sidebar-foreground text-sm leading-tight font-semibold">
            EduAdmin
          </p>
          <p className="text-sidebar-foreground/50 text-xs leading-tight">
            School Portal
          </p>
        </div>
      </div>

      {/* Compose */}
      <div className="px-4 pt-4 pb-2">
        <Button
          onClick={onCompose}
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full gap-2 text-sm font-medium"
          size="sm"
        >
          <PenSquare className="h-4 w-4" />
          Compose Message
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        <p className="text-sidebar-foreground/40 px-2 pt-3 pb-1 text-xs font-medium tracking-wider uppercase">
          Mailbox
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const unread = countUnread(id);
          return (
            <button
              key={id}
              onClick={() => onFolderChange(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                activeFolder === id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {unread > 0 && (
                <span className="bg-primary text-primary-foreground flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold">
                  {unread}
                </span>
              )}
            </button>
          );
        })}

        <p className="text-sidebar-foreground/40 px-2 pt-5 pb-1 text-xs font-medium tracking-wider uppercase">
          Quick Links
        </p>
        {[
          { label: "All Classes", icon: GraduationCap },
          { label: "Staff Directory", icon: Users },
          { label: "Notifications", icon: Bell },
          { label: "Settings", icon: Settings },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="border-sidebar-border border-t px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            <span className="text-primary text-xs font-bold">AD</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sidebar-foreground truncate text-xs font-semibold">
              Administrator
            </p>
            <p className="text-sidebar-foreground/50 truncate text-xs">
              admin@school.edu
            </p>
          </div>
          <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
