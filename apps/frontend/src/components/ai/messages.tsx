/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { UseChatHelpers } from "@ai-sdk/react";
import type { Vote } from "@repo/db";
import equal from "fast-deep-equal";
import { motion } from "framer-motion";
import { memo } from "react";
import { useMessages } from "~/hooks/use-messages";
import type { ChatMessage } from "~/lib/types";
import { useDataStream } from "./data-stream-provider";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";

interface MessagesProps {
  chatId: string;
  // @ts-expect-error TODO fix this
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  // @ts-expect-error TODO fix this
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  // @ts-expect-error TODO fix this
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
}

function PureMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });

  useDataStream();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
    >
      {messages.length === 0 && <Greeting />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          regenerate={regenerate}
          isReadonly={isReadonly}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        // @ts-expect-error TODO fix this
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return false;
});
