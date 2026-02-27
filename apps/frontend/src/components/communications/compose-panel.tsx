"use client";

import { useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronRight,
  FileText,
  Italic,
  Link,
  List,
  ListOrdered,
  Paperclip,
  Redo,
  Send,
  Underline,
  Undo,
  Users,
  X,
} from "lucide-react";

import type { RecipientTarget } from "./recipient-selector";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { getRecipientSummary } from "./recipient-selector";

interface ComposePanelProps {
  target: RecipientTarget;
  onOpenRecipientSelector: () => void;
  onSend: (data: {
    subject: string;
    body: string;
    recipients: string;
    recipientCount: number;
  }) => void;
  onDraft: (data: {
    subject: string;
    body: string;
    recipients: string;
  }) => void;
  onCancel: () => void;
}

// ─── Toolbar button ──────────────────────────────────────────────────────────
function ToolbarBtn({
  icon,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-7 w-7 items-center justify-center rounded transition-colors"
    >
      {icon}
    </button>
  );
}

// ─── Recipient breadcrumb pill ───────────────────────────────────────────────
function RecipientPill({
  target,
  onClick,
}: {
  target: RecipientTarget;
  onClick: () => void;
}) {
  const { breadcrumb, count } = getRecipientSummary(target);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex max-w-full items-center gap-0",
        "border-border bg-muted/60 hover:bg-muted hover:border-primary/40 rounded-full border transition-all",
        "text-foreground py-1 pr-1 pl-2 text-xs font-medium",
      )}
      title="Click to edit recipients"
    >
      <Users className="text-primary mr-1.5 h-3.5 w-3.5 shrink-0" />
      {/* Breadcrumb trail */}
      <span className="flex min-w-0 items-center gap-0.5 overflow-hidden">
        {breadcrumb.map((part, i) => (
          <span key={i} className="flex shrink-0 items-center gap-0.5">
            {i > 0 && (
              <ChevronRight className="text-muted-foreground h-3 w-3 shrink-0" />
            )}
            <span
              className={cn(
                "truncate",
                i === breadcrumb.length - 1
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground",
              )}
            >
              {part}
            </span>
          </span>
        ))}
      </span>
      {/* Count badge */}
      <span className="bg-primary/10 text-primary ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-xs font-bold">
        {count.toLocaleString()}
      </span>
      {/* Edit hint */}
      <span className="text-muted-foreground group-hover:text-primary mr-0.5 ml-1.5 shrink-0 transition-colors">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </span>
    </button>
  );
}

// ─── Compose Panel ───────────────────────────────────────────────────────────
export default function ComposePanel({
  target,
  onOpenRecipientSelector,
  onSend,
  onDraft,
  onCancel,
}: ComposePanelProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const summary = getRecipientSummary(target);
  const canSend = subject.trim().length > 0 && body.trim().length > 0;
  const canDraft = subject.trim().length > 0 || body.trim().length > 0;

  function handleSend() {
    onSend({
      subject,
      body,
      recipients: summary.label,
      recipientCount: summary.count,
    });
  }

  function handleDraft() {
    onDraft({
      subject: subject || "(No subject)",
      body,
      recipients: summary.label,
    });
  }

  return (
    <div className="bg-card flex h-full flex-col">
      {/* Top bar */}
      <div className="border-border flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-foreground text-base font-semibold">
            New Bulk Message
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Compose and send your message below
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          title="Discard"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        {/* To field */}
        <div className="border-border flex items-start gap-3 border-b px-6 py-3">
          <Label className="text-muted-foreground w-14 shrink-0 pt-1.5 text-xs font-semibold">
            To
          </Label>
          <div className="flex min-h-[32px] flex-1 flex-wrap items-center gap-2">
            <RecipientPill target={target} onClick={onOpenRecipientSelector} />
          </div>
        </div>

        {/* Subject field */}
        <div className="border-border flex items-center gap-3 border-b px-6 py-3">
          <Label
            htmlFor="compose-subject"
            className="text-muted-foreground w-14 shrink-0 text-xs font-semibold"
          >
            Subject
          </Label>
          <Input
            id="compose-subject"
            placeholder="Enter message subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-8 border-0 px-0 text-sm font-medium shadow-none placeholder:font-normal focus-visible:ring-0"
          />
        </div>

        {/* Body — Rich text editor placeholder */}
        <div className="flex flex-1 flex-col">
          {/* Toolbar */}
          <div className="border-border bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-5 py-2">
            <ToolbarBtn icon={<Undo className="h-3.5 w-3.5" />} title="Undo" />
            <ToolbarBtn icon={<Redo className="h-3.5 w-3.5" />} title="Redo" />
            <div className="bg-border mx-1 h-4 w-px" />
            <ToolbarBtn icon={<Bold className="h-3.5 w-3.5" />} title="Bold" />
            <ToolbarBtn
              icon={<Italic className="h-3.5 w-3.5" />}
              title="Italic"
            />
            <ToolbarBtn
              icon={<Underline className="h-3.5 w-3.5" />}
              title="Underline"
            />
            <div className="bg-border mx-1 h-4 w-px" />
            <ToolbarBtn
              icon={<AlignLeft className="h-3.5 w-3.5" />}
              title="Align left"
            />
            <ToolbarBtn
              icon={<AlignCenter className="h-3.5 w-3.5" />}
              title="Align center"
            />
            <ToolbarBtn
              icon={<AlignRight className="h-3.5 w-3.5" />}
              title="Align right"
            />
            <div className="bg-border mx-1 h-4 w-px" />
            <ToolbarBtn
              icon={<List className="h-3.5 w-3.5" />}
              title="Bullet list"
            />
            <ToolbarBtn
              icon={<ListOrdered className="h-3.5 w-3.5" />}
              title="Numbered list"
            />
            <div className="bg-border mx-1 h-4 w-px" />
            <ToolbarBtn
              icon={<Link className="h-3.5 w-3.5" />}
              title="Insert link"
            />
          </div>

          {/* Editable area */}
          <textarea
            placeholder="Write your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={cn(
              "w-full flex-1 resize-none px-6 py-4 text-sm leading-relaxed",
              "bg-card text-foreground placeholder:text-muted-foreground",
              "min-h-[280px] focus:outline-none",
              "font-sans",
            )}
            rows={14}
          />
        </div>
      </div>

      {/* Footer actions */}
      <Separator />
      <div className="flex items-center justify-between px-6 py-4">
        {/* Attachment */}
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors"
        >
          <Paperclip className="h-3.5 w-3.5" />
          Attach file
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDraft}
            disabled={!canDraft}
            className="gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!canSend}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Send to {summary.count.toLocaleString()}{" "}
            {summary.count === 1 ? "person" : "people"}
          </Button>
        </div>
      </div>
    </div>
  );
}
