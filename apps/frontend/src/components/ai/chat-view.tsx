"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";



import type { AiChatDetail } from "./types";
import { env } from "~/env";
import { fetcher } from "~/lib/utils";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";


export function ChatView({ chatId }: { chatId?: string }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [activeChatId, setActiveChatId] = useState(chatId);
  const lastSavedHashRef = useRef<string>("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const provider = env.NEXT_PUBLIC_AI_PROVIDER ?? "openai";
  const model = env.NEXT_PUBLIC_AI_MODEL;

  useEffect(() => {
    setActiveChatId(chatId);
  }, [chatId]);

  const { data: chatDetail, isLoading: isLoadingChat } =
    useSWR<AiChatDetail>(
      chatId ? `/api/ai/chat/${chatId}` : null,
      fetcher,
    );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/chat",
        body: {
          chatId: activeChatId,
          provider,
          model,
        },
        fetch: async (requestInfo, init) => {
          const response = await fetch(requestInfo, init);
          const responseChatId = response.headers.get("x-ai-chat-id");

          if (responseChatId && responseChatId !== activeChatId) {
            setActiveChatId(responseChatId);
            router.replace(`/ai/${responseChatId}`);
            void mutate(
              (key) =>
                typeof key === "string" && key.startsWith("/api/ai/history"),
              undefined,
              { revalidate: true },
            );
          }

          return response;
        },
      }),
    // mutate and router are stable refs from SWR/Next.js
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeChatId, provider, model],
  );

  const { messages, setMessages, sendMessage, status, stop, error } = useChat({
    transport,
    onError(chatError: Error) {
      toast.error(chatError.message || "Failed to send message.");
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!chatDetail) {
      return;
    }

    setMessages(chatDetail.messages);
    lastSavedHashRef.current = JSON.stringify(chatDetail.messages);
  }, [chatDetail, setMessages]);

  // Debounced auto-save after streaming completes
  useEffect(() => {
    if (!activeChatId || isLoading || messages.length === 0) {
      return;
    }

    const payload = JSON.stringify({ messages, provider, model });
    if (payload === lastSavedHashRef.current) {
      return;
    }

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      lastSavedHashRef.current = payload;

      void fetch(`/api/ai/chat/${activeChatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to persist chat.");
          }

          await mutate(
            (key) =>
              typeof key === "string" && key.startsWith("/api/ai/history"),
            undefined,
            { revalidate: true },
          );
        })
        .catch(() => {
          lastSavedHashRef.current = "";
        });
    }, 500);

    return () => clearTimeout(saveTimerRef.current);
  }, [activeChatId, isLoading, messages, provider, model, mutate]);

  const handleSend = useCallback(
    (text: string) => sendMessage({ text }),
    [sendMessage],
  );

  const handleStop = useCallback(() => {
    void stop();
  }, [stop]);

  return (
    <div className="bg-background flex h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        <ChatMessages
          error={error}
          isLoading={isLoading}
          isLoadingChat={isLoadingChat}
          messages={messages}
        />
        <ChatInput
          isLoading={isLoading}
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}