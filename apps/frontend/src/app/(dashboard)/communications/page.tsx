"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";

import type { Message } from "~/components/communications/mock-data";
import { useCommunications } from "~/components/communications/communications-context";
import ComposePanel from "~/components/communications/compose-panel";
import MessageList from "~/components/communications/message-list";
import MessageView from "~/components/communications/message-view";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export default function InboxPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [activeFolder, setActiveFolder] = useState<"sent" | "drafts">("sent");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const { composeStage, recipientTarget, startCompose, cancelCompose } =
    useCommunications();

  const isComposing = composeStage === "composing";

  // ── Fetch bulk emails from server ─────────────────────────────────────────

  const { data: serverData, isLoading } = useQuery(
    trpc.bulkEmail.list.queryOptions({ folder: activeFolder, limit: 50 }),
  );

  const messages: Message[] = useMemo(() => {
    if (!serverData) return [];
    return serverData.emails.map((e) => {
      const target = e.recipientTarget as Record<string, unknown> | null;
      const toLabel =
        typeof target?.resolvedLabel === "string"
          ? target.resolvedLabel
          : `${e.recipientCount} recipient(s)`;

      return {
        id: e.id,
        subject: e.subject,
        preview: e.preview,
        from: e.sender.name,
        to: toLabel,
        date:
          e.sentAt?.toISOString().split("T")[0] ??
          e.createdAt.toISOString().split("T")[0] ??
          "",
        read: true,
        folder: e.status === "DRAFT" ? ("drafts" as const) : ("sent" as const),
        recipientCount: e.recipientCount,
        body: e.body,
      };
    });
  }, [serverData]);

  const activeMessage = useMemo(
    () => messages.find((m) => m.id === activeMessageId) ?? null,
    [messages, activeMessageId],
  );

  // ── Mutations ─────────────────────────────────────────────────────────────

  const sendMutation = useMutation(
    trpc.bulkEmail.send.mutationOptions({
      onSuccess: (result) => {
        toast.success(
          `Email sent to ${result.recipientCount} recipient(s)${result.failedCount > 0 ? ` (${result.failedCount} failed)` : ""}`,
        );
        void queryClient.invalidateQueries(
          trpc.bulkEmail.list.queryOptions({ folder: "sent", limit: 50 }),
        );
        setActiveFolder("sent");
        setActiveMessageId(result.id);
        cancelCompose();
      },
      onError: (err) => {
        toast.error(`Failed to send: ${err.message}`);
      },
    }),
  );

  const draftMutation = useMutation(
    trpc.bulkEmail.saveDraft.mutationOptions({
      onSuccess: (result) => {
        toast.success("Draft saved");
        void queryClient.invalidateQueries(
          trpc.bulkEmail.list.queryOptions({ folder: "drafts", limit: 50 }),
        );
        setActiveFolder("drafts");
        setActiveMessageId(result.id);
        cancelCompose();
      },
      onError: (err) => {
        toast.error(`Failed to save draft: ${err.message}`);
      },
    }),
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSelectMessage(msg: Message) {
    setActiveMessageId(msg.id);
    cancelCompose();
  }

  function handleComposeClick() {
    setActiveMessageId(null);
    startCompose();
  }

  function handleSend(data: {
    subject: string;
    body: string;
    recipients: string;
    recipientCount: number;
  }) {
    if (!recipientTarget) {
      toast.error("Please select recipients before sending.");
      return;
    }
    sendMutation.mutate({
      subject: data.subject,
      body: data.body,
      recipientTarget,
    });
  }

  function handleDraft(data: {
    subject: string;
    body: string;
    recipients: string;
  }) {
    draftMutation.mutate({
      subject: data.subject || "(No subject)",
      body: data.body,
      recipientTarget: recipientTarget ?? {
        mode: "broadcast",
        classIds: [],
        broadcastRoles: [],
        classRecipientMode: "all",
        specificPersonIds: [],
        resolvedCount: 0,
        resolvedLabel: "",
        breadcrumb: [],
      },
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex min-w-0 flex-1 overflow-hidden">
        {/* Message list panel */}
        <div
          className={cn(
            "border-border flex flex-col",
            "w-full shrink-0 sm:w-80 md:w-96 lg:w-80 xl:w-96",
            isComposing || activeMessageId ? "hidden sm:flex" : "flex",
          )}
        >
          <div className="border-border flex items-center gap-2 border-b px-3 py-2 lg:hidden" />
          <div className="flex flex-1 flex-col overflow-hidden">
            {isLoading ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                Loading...
              </div>
            ) : (
              <MessageList
                messages={messages}
                activeMessageId={activeMessageId}
                onSelectMessage={handleSelectMessage}
                folder={activeFolder}
              />
            )}
          </div>
        </div>

        {/* Right panel: compose or message view */}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            !isComposing && !activeMessageId ? "hidden sm:flex" : "flex",
          )}
        >
          {isComposing ? (
            <ComposePanel
              onSend={handleSend}
              onDraft={handleDraft}
              onCancel={cancelCompose}
              isSending={sendMutation.isPending}
              isSavingDraft={draftMutation.isPending}
            />
          ) : (
            <>
              {/* Mobile back button */}
              {activeMessageId && (
                <div className="border-border b flex items-center gap-2 border-b px-3 py-2 sm:hidden">
                  <button
                    onClick={() => setActiveMessageId(null)}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Back to inbox
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <MessageView
                  message={activeMessage}
                  onReply={handleComposeClick}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
