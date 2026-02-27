"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";

import type { Message } from "./mock-data";
import { cn } from "~/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { formatDate, getInitials } from "./mock-data";

interface MessageListProps {
  messages: Message[];
  activeMessageId: string | null;
  onSelectMessage: (msg: Message) => void;
  folder: string;
}

const FOLDER_LABELS: Record<string, string> = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  trash: "Trash",
};

export default function MessageList({
  messages,
  activeMessageId,
  onSelectMessage,
  folder,
}: MessageListProps) {
  const [search, setSearch] = useState("");

  const filtered = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.from.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="border-border flex h-full flex-col border-r bg-transparent">
      {/* Header */}
      <div className="border-border border-b px-4 pt-4 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-foreground text-base font-semibold">
            {FOLDER_LABELS[folder] ?? folder}
          </h2>
          <span className="text-muted-foreground text-xs">
            {filtered.length} messages
          </span>
        </div>
        <InputGroup>
          <InputGroupInput
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* List */}
      <div className="divide-border flex-1 divide-y overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 py-12">
            <Search className="h-8 w-8 opacity-30" />
            <p className="text-sm">No messages found</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={() => onSelectMessage(msg)}
              className={cn(
                "block w-full px-4 py-3.5 text-left transition-colors",
                activeMessageId === msg.id
                  ? "bg-primary/8 border-l-primary border-l-2"
                  : "hover:bg-muted/60 border-l-2 border-l-transparent",
                !msg.read && activeMessageId !== msg.id && "bg-badge-blue/30",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="bg-muted mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  <span className="text-muted-foreground text-xs font-semibold">
                    {getInitials(msg.from)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        !msg.read
                          ? "text-foreground font-semibold"
                          : "text-foreground/80 font-medium",
                      )}
                    >
                      {msg.folder === "sent" || msg.folder === "drafts"
                        ? `To: ${msg.to}`
                        : msg.from}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatDate(msg.date)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mb-1 truncate text-xs",
                      !msg.read
                        ? "text-foreground/90 font-medium"
                        : "text-foreground/70",
                    )}
                  >
                    {msg.subject}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground flex-1 truncate text-xs">
                      {msg.preview}
                    </p>
                    {msg.recipientCount !== undefined &&
                      msg.recipientCount > 0 && (
                        <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                          <Users className="h-3 w-3" />
                          {msg.recipientCount}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              {!msg.read && activeMessageId !== msg.id && (
                <div className="bg-primary absolute top-1/2 right-4 h-2 w-2 -translate-y-1/2 rounded-full" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
