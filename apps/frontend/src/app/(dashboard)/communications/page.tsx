"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import type { Message } from "~/components/communications/mock-data";
import { useCommunications } from "~/components/communications/communications-context";
import ComposePanel from "~/components/communications/compose-panel";
import MessageList from "~/components/communications/message-list";
import MessageView from "~/components/communications/message-view";
import { MOCK_MESSAGES } from "~/components/communications/mock-data";
import { cn } from "~/lib/utils";

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const { composeStage, startCompose, cancelCompose } = useCommunications();

  const isComposing = composeStage === "composing";

  const folderMessages = useMemo(
    () => messages.filter((m) => m.folder === activeFolder),
    [messages, activeFolder],
  );

  const activeMessage = useMemo(
    () => messages.find((m) => m.id === activeMessageId) ?? null,
    [messages, activeMessageId],
  );

  function handleSelectMessage(msg: Message) {
    setActiveMessageId(msg.id);
    cancelCompose();
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
    );
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
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      subject: data.subject,
      preview: data.body.slice(0, 100) + (data.body.length > 100 ? "..." : ""),
      from: "Admin",
      to: data.recipients,
      date: new Date().toISOString().split("T")[0] ?? "",
      read: true,
      folder: "sent",
      recipientCount: data.recipientCount,
      body: data.body,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setActiveFolder("sent");
    setActiveMessageId(newMsg.id);
    cancelCompose();
  }

  function handleDraft(data: {
    subject: string;
    body: string;
    recipients: string;
  }) {
    const newMsg: Message = {
      id: `draft-${Date.now()}`,
      subject: data.subject || "(No subject)",
      preview: data.body.slice(0, 100) + (data.body.length > 100 ? "..." : ""),
      from: "Admin",
      to: data.recipients,
      date: new Date().toISOString().split("T")[0] ?? "",
      read: true,
      folder: "drafts",
      body: data.body,
    };
    setMessages((prev) => [newMsg, ...prev]);
    setActiveFolder("drafts");
    setActiveMessageId(newMsg.id);
    cancelCompose();
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex min-w-0 flex-1 overflow-hidden">
        {/* Message list panel */}
        <div
          className={cn(
            "border-border bg-card flex flex-col border-r",
            "w-full shrink-0 sm:w-80 md:w-96 lg:w-80 xl:w-96",
            isComposing || activeMessageId ? "hidden sm:flex" : "flex",
          )}
        >
          {/* Mobile top bar */}
          <div className="border-border bg-card flex items-center gap-2 border-b px-3 py-2 lg:hidden" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <MessageList
              messages={folderMessages}
              activeMessageId={activeMessageId}
              onSelectMessage={handleSelectMessage}
              folder={activeFolder}
            />
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
            />
          ) : (
            <>
              {/* Mobile back button */}
              {activeMessageId && (
                <div className="border-border bg-card flex items-center gap-2 border-b px-3 py-2 sm:hidden">
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
