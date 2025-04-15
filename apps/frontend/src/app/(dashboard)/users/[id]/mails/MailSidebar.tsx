"use client";

import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { FileText, Inbox, Plus, Send, Tag, Trash } from "lucide-react";
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
    setComposing(true);
    setAttachedFiles([]);
  };
  return (
    <div className="w-64 border-r p-4 flex flex-col h-full">
      <Button className="mb-6 w-full" onClick={handleComposeClick}>
        <Plus className="mr-2 h-4 w-4" /> Compose
      </Button>

      <nav className="space-y-1">
        <Button
          variant={activeView === "inbox" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleFolderClick("inbox")}
        >
          <Inbox className="mr-2 h-4 w-4" /> Inbox
        </Button>
        <Button
          variant={activeView === "sent" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleFolderClick("sent")}
        >
          <Send className="mr-2 h-4 w-4" /> Sent
        </Button>
        <Button
          variant={activeView === "drafts" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleFolderClick("drafts")}
        >
          <FileText className="mr-2 h-4 w-4" /> Drafts
        </Button>
      </nav>

      <Separator className="my-4" />

      <div className="text-sm font-medium mb-2">Groups</div>
      <nav className="space-y-1">
        <Button
          variant={activeView === "work" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleFolderClick("work")}
        >
          <Tag className="mr-2 h-4 w-4" /> Work
        </Button>
        <Button
          variant={activeView === "personal" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleFolderClick("personal")}
        >
          <Tag className="mr-2 h-4 w-4" /> Personal
        </Button>
        <Button
          variant={activeView === "newsletters" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleFolderClick("newsletters")}
        >
          <Tag className="mr-2 h-4 w-4" /> Newsletters
        </Button>
      </nav>

      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start">
          <Trash className="mr-2 h-4 w-4" /> Trash
        </Button>
      </div>
    </div>
  );
}
