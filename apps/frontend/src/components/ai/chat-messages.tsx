"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import { isTextUIPart, isToolUIPart } from "ai";

import { cn } from "~/lib/utils";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  isLoadingChat: boolean;
  error: Error | undefined;
}

export function ChatMessages({
  messages,
  isLoading,
  isLoadingChat,
  error,
}: ChatMessagesProps) {
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const isIdleWithoutMessages = !isLoading && messages.length === 0;

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isLoading, messages]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
      {isLoadingChat && (
        <p className="text-muted-foreground text-center text-sm">
          Loading conversation...
        </p>
      )}

      {isIdleWithoutMessages && (
        <div className="mx-auto mt-16 max-w-xl text-center">
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Ask anything to start a new conversation.
          </p>
        </div>
      )}

      {messages.map((message) => {
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
              {message.parts.map((part, index) => {
                if (isTextUIPart(part)) {
                  return (
                    <p className="whitespace-pre-wrap" key={index}>
                      {part.text}
                    </p>
                  );
                }

                if (isToolUIPart(part)) {
                  return (
                    <div
                      className="bg-muted/50 my-1 rounded px-3 py-2 font-mono text-xs"
                      key={part.toolCallId}
                    >
                      <span className="font-semibold">
                        {part.type.replace("tool-", "")}
                      </span>
                      {part.state === "output-available" && (
                        <pre className="mt-1 overflow-x-auto">
                          {JSON.stringify(part.output, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}

      {error ? (
        <p className="text-destructive text-center text-sm">{error.message}</p>
      ) : null}

      <div ref={scrollAnchorRef} />
    </div>
  );
}
