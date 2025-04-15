"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";
import { Search } from "lucide-react";
import { useLocale } from "~/i18n";
import { useMailContext } from "./MailContextProvider";

export function MailList() {
  const {
    activeView,
    composing,
    selectedEmail,
    setComposing,
    emails,
    setSelectedEmail,
    setAttachedFiles,
  } = useMailContext();

  const filteredEmails = emails.filter((email) => {
    if (
      activeView === "inbox" ||
      activeView === "sent" ||
      activeView === "drafts"
    ) {
      return email.folder === activeView;
    } else {
      return email.group === activeView;
    }
  });

  const handleEmailClick = (id: string) => {
    setSelectedEmail(id);
    setComposing(false);
    setAttachedFiles([]);
  };
  const { i18n } = useLocale();

  return (
    <div
      className={cn(
        "w-80 border-r overflow-y-auto",
        (selectedEmail ?? composing) && "hidden md:block",
      )}
    >
      <div className="p-4 border-b sticky top-0 bg-background">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search emails" className="pl-8" />
        </div>
      </div>

      <div className="divide-y">
        {filteredEmails.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No emails found in this folder.
          </div>
        )}
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={cn(
              "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
              email.id === selectedEmail && "bg-muted",
              !email.read && "font-medium",
            )}
            onClick={() => handleEmailClick(email.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/placeholder.svg?height=32&width=32`}
                  alt={email.from ?? ""}
                />
                <AvatarFallback>{email.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="truncate font-medium">{email.from}</div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {email.date.toLocaleDateString(i18n.language, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
                <div className="text-sm truncate">{email.subject}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {email.preview}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
