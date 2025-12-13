"use client";

import { Search } from "lucide-react";
import { useLocale } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
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
  const locale = useLocale();

  return (
    <div
      className={cn(
        "w-80 overflow-y-auto border-r",
        (selectedEmail ?? composing) && "hidden md:block",
      )}
    >
      <div className="bg-background sticky top-0 border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input placeholder="Search emails" className="pl-8" />
        </div>
      </div>

      <div className="divide-y">
        {filteredEmails.length === 0 && (
          <div className="text-muted-foreground p-4 text-center">
            No emails found in this folder.
          </div>
        )}
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={cn(
              "hover:bg-muted/50 cursor-pointer p-3 transition-colors",
              email.id === selectedEmail && "bg-muted",
              !email.read && "font-medium",
            )}
            onClick={() => handleEmailClick(email.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`/placeholder.svg?height=32&width=32`}
                  alt={email.from}
                />
                <AvatarFallback>{email.avatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium">{email.from}</div>
                  <div className="text-muted-foreground ml-2 text-xs whitespace-nowrap">
                    {email.date.toLocaleDateString(locale, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
                <div className="truncate text-sm">{email.subject}</div>
                <div className="text-muted-foreground truncate text-xs">
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
