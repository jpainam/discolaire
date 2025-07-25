import type { UseChatHelpers } from "@ai-sdk/react";
import { useEffect, useState } from "react";

import type { ChatMessage } from "~/lib/types";
import { useScrollToBottom } from "./use-scroll-to-bottom";

export function useMessages({
  chatId,
  status,
}: {
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
}) {
  const {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  } = useScrollToBottom();

  const [hasSentMessage, setHasSentMessage] = useState(false);

  useEffect(() => {
    if (chatId) {
      scrollToBottom("instant");
      setHasSentMessage(false);
    }
  }, [chatId, scrollToBottom]);

  useEffect(() => {
    if (status === "submitted") {
      setHasSentMessage(true);
    }
  }, [status]);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  };
}
