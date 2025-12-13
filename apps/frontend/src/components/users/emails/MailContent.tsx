"use client";

import { cn } from "~/lib/utils";
import { MailCompose } from "./MailCompose";
import { useMailContext } from "./MailContextProvider";
import { MailDetail } from "./MailDetail";

export function MailContent() {
  const { selectedEmail, composing } = useMailContext();

  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col overflow-hidden",
        !selectedEmail && !composing && "hidden md:flex",
      )}
    >
      {composing ? (
        <MailCompose />
      ) : selectedEmail ? (
        <MailDetail emailId={selectedEmail} />
      ) : (
        <div className="text-muted-foreground flex flex-1 items-center justify-center">
          Select an email to view or compose a new message
        </div>
      )}
    </div>
  );
}
