"use client";

import { Archive, Forward, Mail, Reply, Trash2, Users } from "lucide-react";

import type { Message } from "./mock-data";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { formatDate, getInitials } from "./mock-data";

interface MessageViewProps {
  message: Message | null;
  onReply?: () => void;
}

export default function MessageView({ message, onReply }: MessageViewProps) {
  if (!message) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3">
        <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
          <Mail className="h-6 w-6 opacity-40" />
        </div>
        <div className="text-center">
          <p className="text-foreground/60 text-sm font-medium">
            Select a message to read
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Choose from the list on the left
          </p>
        </div>
      </div>
    );
  }

  const isSent = message.folder === "sent" || message.folder === "drafts";

  return (
    <div className="bg-background flex h-full flex-col">
      {/* Toolbar */}
      <div className="border-border bg-card flex items-center gap-2 border-b px-6 py-3">
        {!isSent && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={onReply}
          >
            <Reply className="h-3.5 w-3.5" /> Reply
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
          <Forward className="h-3.5 w-3.5" /> Forward
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
          <Archive className="h-3.5 w-3.5" /> Archive
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive h-8 gap-1.5 text-xs"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Subject */}
        <h1 className="text-foreground mb-4 text-xl font-semibold text-pretty">
          {message.subject}
        </h1>

        {/* Meta card */}
        <div className="bg-muted/50 border-border mb-6 flex items-start gap-3 rounded-lg border p-4">
          <div className="bg-primary/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <span className="text-primary text-sm font-bold">
              {getInitials(message.from)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-foreground text-sm font-semibold">
                  {message.from}
                </span>
                <span className="text-muted-foreground ml-2 text-xs">
                  &lt;{message.from.toLowerCase().replace(/[^a-z]/g, ".")}
                  @school.edu&gt;
                </span>
              </div>
              <span className="text-muted-foreground text-xs">
                {formatDate(message.date)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-muted-foreground text-xs">
                <span className="font-medium">To:</span> {message.to}
              </p>
              {message.recipientCount !== undefined &&
                message.recipientCount > 0 && (
                  <span className="bg-badge-blue text-badge-blue-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                    <Users className="h-3 w-3" />
                    {message.recipientCount} recipients
                  </span>
                )}
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Body */}
        <div className="prose prose-sm max-w-none">
          {(message.body ?? message.preview).split("\n").map((line, i) => (
            <p
              key={i}
              className={
                line.trim() === ""
                  ? "mt-3"
                  : "text-foreground/85 text-sm leading-relaxed"
              }
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
