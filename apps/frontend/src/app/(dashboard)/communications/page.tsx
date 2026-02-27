"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import type { Message } from "~/components/communications/mock-data";
import type { RecipientTarget } from "~/components/communications/recipient-selector";
import ComposePanel from "~/components/communications/compose-panel";
import MessageList from "~/components/communications/message-list";
import MessageView from "~/components/communications/message-view";
import { MOCK_MESSAGES } from "~/components/communications/mock-data";
import { cn } from "~/lib/utils";

type ComposeSta =
  | { stage: "idle" }
  | { stage: "selecting-recipients" }
  | { stage: "composing"; target: RecipientTarget }
  | { stage: "editing-recipients"; target: RecipientTarget };

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [composeState, setComposeState] = useState<ComposeSta>({
    stage: "idle",
  });

  const isComposing =
    composeState.stage === "composing" ||
    composeState.stage === "editing-recipients";

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

    setComposeState({ stage: "idle" });
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
    );
  }

  function handleComposeClick() {
    setActiveMessageId(null);

    setComposeState({ stage: "selecting-recipients" });
  }

  // function handleRecipientConfirm(target: RecipientTarget) {
  //   if (composeState.stage === "editing-recipients") {
  //     setComposeState({ stage: "composing", target });
  //   } else {
  //     setComposeState({ stage: "composing", target });
  //   }
  // }

  // function handleRecipientCancel() {
  //   if (composeState.stage === "editing-recipients") {
  //     // Go back to composing with whatever target was there
  //     setComposeState({
  //       stage: "composing",
  //       target: (
  //         composeState as {
  //           stage: "editing-recipients";
  //           target: RecipientTarget;
  //         }
  //       ).target,
  //     });
  //   } else {
  //     setComposeState({ stage: "idle" });
  //   }
  // }

  function handleEditRecipients() {
    if (composeState.stage === "composing") {
      setComposeState({
        stage: "editing-recipients",
        target: composeState.target,
      });
    }
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
    setComposeState({ stage: "idle" });
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
    setComposeState({ stage: "idle" });
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
          <div className="border-border bg-card flex items-center gap-2 border-b px-3 py-2 lg:hidden">
            {/* <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:bg-muted rounded-md p-2 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button> */}
          </div>
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
          {isComposing && composeState.stage === "composing" ? (
            <ComposePanel
              target={composeState.target}
              onOpenRecipientSelector={handleEditRecipients}
              onSend={handleSend}
              onDraft={handleDraft}
              onCancel={() => setComposeState({ stage: "idle" })}
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
