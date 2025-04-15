"use client";

import { cn } from "@repo/ui/lib/utils";
import { MailCompose } from "./MailCompose";
import { useMailContext } from "./MailContextProvider";
import { MailDetail } from "./MailDetail";

export function MailContent() {
  const { selectedEmail, composing } = useMailContext();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col h-full overflow-hidden",
        !selectedEmail && !composing && "hidden md:flex"
      )}
    >
      {composing ? (
        <MailCompose />
      ) : selectedEmail ? (
        <MailDetail emailId={selectedEmail} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select an email to view or compose a new message
        </div>
      )}
    </div>
  );
}
