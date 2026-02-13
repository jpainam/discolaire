"use client";

import { DefaultChatTransport, isTextUIPart } from "ai";
import type { UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { SendHorizontalIcon, SquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env";
import { cn, fetcher } from "~/lib/utils";

import type { AiChatDetail } from "./types";

function getMessageText(message: UIMessage): string {
  if (!Array.isArray(message.parts)) {
    return "";
  }

  return message.parts
    .map((part) => {
      if (isTextUIPart(part)) {
        return part.text;
      }

      return "";
    })
    .join("\n")
    .trim();
}

export function ChatView({ chatId }: { chatId?: string }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [activeChatId, setActiveChatId] = useState(chatId);
  const lastSavedHashRef = useRef<string>("");
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const provider = env.NEXT_PUBLIC_AI_PROVIDER ?? "openai";
  const model = env.NEXT_PUBLIC_AI_MODEL;
  const [input, setInput] = useState("");

  useEffect(() => {
    setActiveChatId(chatId);
  }, [chatId]);

  const { data: chatDetail, isLoading: isLoadingChat } = useSWR<AiChatDetail>(
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
              (key) => typeof key === "string" && key.startsWith("/api/ai/history"),
              undefined,
              { revalidate: true },
            );
          }

          return response;
        },
      }),
    [activeChatId, model, mutate, provider, router],
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

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isLoading, messages]);

  const isIdleWithoutMessages = !isLoading && messages.length === 0;

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextInput = input.trim();
    if (!nextInput || isLoading) {
      return;
    }

    setInput("");

    void sendMessage({ text: nextInput }).catch((chatError) => {
      setInput(nextInput);
      if (chatError instanceof Error) {
        toast.error(chatError.message || "Failed to send message.");
      }
    });
  };

  const savePayload = useMemo(
    () =>
      JSON.stringify({
        messages,
        provider,
        model,
      }),
    [messages, provider, model],
  );

  useEffect(() => {
    if (!activeChatId || isLoading || messages.length === 0) {
      return;
    }

    if (savePayload === lastSavedHashRef.current) {
      return;
    }

    lastSavedHashRef.current = savePayload;

    void fetch(`/api/ai/chat/${activeChatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: savePayload,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to persist chat.");
        }

        await mutate(
          (key) => typeof key === "string" && key.startsWith("/api/ai/history"),
          undefined,
          { revalidate: true },
        );
      })
      .catch(() => {
        lastSavedHashRef.current = "";
      });
  }, [activeChatId, isLoading, messages.length, mutate, savePayload]);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {isLoadingChat && (
            <p className="text-center text-muted-foreground text-sm">
              Loading conversation...
            </p>
          )}

          {isIdleWithoutMessages && (
            <div className="mx-auto mt-16 max-w-xl text-center">
              <h1 className="font-semibold text-2xl">AI Assistant</h1>
              <p className="mt-2 text-muted-foreground text-sm">
                Ask anything to start a new conversation.
              </p>
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message);
            const isUser = message.role === "user";

            return (
              <div
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
                key={message.id}
              >
                <div
                  className={cn(
                    "max-w-[90%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {text ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <p className="italic opacity-70">Unsupported message format.</p>
                  )}
                </div>
              </div>
            );
          })}

          {error ? (
            <p className="text-center text-destructive text-sm">{error.message}</p>
          ) : null}

          <div ref={scrollAnchorRef} />
        </div>

        <form className="mt-4 border-t pt-4" onSubmit={handleFormSubmit}>
          <div className="rounded-xl border bg-card p-3">
            <Textarea
              className="min-h-[100px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              value={input}
            />
            <div className="mt-3 flex justify-end gap-2">
              {isLoading ? (
                <Button
                  onClick={() => {
                    void stop();
                  }}
                  type="button"
                  variant="outline"
                >
                  <SquareIcon className="size-4" />
                  Stop
                </Button>
              ) : null}
              <Button disabled={!input.trim()} type="submit">
                <SendHorizontalIcon className="size-4" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
