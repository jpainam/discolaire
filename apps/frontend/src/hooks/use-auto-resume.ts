/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { useEffect } from "react";
import { useDataStream } from "~/components/ai/data-stream-provider";
import type { ChatMessage } from "~/lib/types";

export interface UseAutoResumeParams {
  autoResume: boolean;
  initialMessages: ChatMessage[];
  // @ts-expect-error - This is a custom type for the chat message status
  resumeStream: UseChatHelpers<ChatMessage>["resumeStream"];
  // @ts-expect-error - This is a custom type for the chat message status
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
}

export function useAutoResume({
  autoResume,
  initialMessages,
  resumeStream,
  setMessages,
}: UseAutoResumeParams) {
  const { dataStream } = useDataStream();

  useEffect(() => {
    if (!autoResume) return;

    const mostRecentMessage = initialMessages.at(-1);

    if (mostRecentMessage?.role === "user") {
      resumeStream();
    }

    // we intentionally run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!dataStream) return;
    if (dataStream.length === 0) return;

    const dataPart = dataStream[0];

    if (dataPart && dataPart.type === "data-appendMessage") {
      // @ts-expect-error - This is a custom type for the chat message status
      const message = JSON.parse(dataPart.data);
      setMessages([...initialMessages, message]);
    }
  }, [dataStream, initialMessages, setMessages]);
}
