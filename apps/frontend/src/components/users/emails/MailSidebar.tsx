"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Archive,
  Edit,
  Inbox,
  Mail,
  Plus,
  Send,
  Tag,
  Trash,
} from "lucide-react";
import { useMailContext } from "./MailContextProvider";

export function MailSidebar() {
  const {
    activeView,
    setActiveView,
    setComposing,
    setSelectedEmail,
    setAttachedFiles,
  } = useMailContext();

  const handleComposeClick = () => {
    setSelectedEmail(null);
    setComposing(true);
  };

  // Handle folder/group click
  const handleFolderClick = (folder: string) => {
    setActiveView(folder);
    setSelectedEmail(null);
    setComposing(false);
    setAttachedFiles([]);
  };
  return (
    <div className="w-56 border-r bg-muted/20 flex flex-col h-full">
      <div className="p-4">
        <Button
          className="justify-start gap-2 w-full"
          onClick={handleComposeClick}
        >
          <Edit className="h-4 w-4" /> Compose
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-2">
          <div className="space-y-1">
            <NavItem
              icon={<Inbox className="h-4 w-4" />}
              label="Inbox"
              count={12}
              active={activeView === "inbox"}
              onClick={() => handleFolderClick("inbox")}
            />
            <NavItem
              icon={<Send className="h-4 w-4" />}
              label="Sent"
              active={activeView === "sent"}
              onClick={() => handleFolderClick("sent")}
            />
            <NavItem
              icon={<Mail className="h-4 w-4" />}
              label="Unread"
              count={5}
              active={activeView === "unread"}
              onClick={() => handleFolderClick("unread")}
            />
            <NavItem
              icon={<Edit className="h-4 w-4" />}
              label="Drafts"
              count={3}
              active={activeView === "drafts"}
              onClick={() => handleFolderClick("drafts")}
            />
            <NavItem
              icon={<Archive className="h-4 w-4" />}
              label="Archived"
              active={activeView === "archived"}
              onClick={() => handleFolderClick("archived")}
            />
          </div>
          <div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium">MANAGED LABELS</span>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              <NavItem
                icon={<Tag className="h-4 w-4 text-red-500" />}
                label="Important"
                active={activeView === "important"}
                onClick={() => handleFolderClick("important")}
              />
              <NavItem
                icon={<Tag className="h-4 w-4 text-yellow-500" />}
                label="Personal"
                active={activeView === "personal"}
                onClick={() => handleFolderClick("personal")}
              />
              <NavItem
                icon={<Tag className="h-4 w-4 text-green-500" />}
                label="Work"
                active={activeView === "work"}
                onClick={() => handleFolderClick("work")}
              />
              <NavItem
                icon={<Tag className="h-4 w-4 text-blue-500" />}
                label="Projects"
                active={activeView === "projects"}
                onClick={() => handleFolderClick("projects")}
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start">
          <Trash className="mr-2 h-4 w-4" /> Trash
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, count, active, onClick }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {count}
        </Badge>
      )}
    </button>
  );
}
