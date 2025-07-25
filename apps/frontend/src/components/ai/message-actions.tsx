import { memo } from "react";
import equal from "fast-deep-equal";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useCopyToClipboard } from "usehooks-ts";

import type { Vote } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";

import type { ChatMessage } from "~/lib/types";
import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from "./icons";

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: ChatMessage;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="text-muted-foreground h-fit px-2 py-1"
              variant="outline"
              onClick={async () => {
                const textFromParts = message.parts
                  .filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("\n")
                  .trim();

                if (!textFromParts) {
                  toast.error("There's no text to copy!");
                  return;
                }

                await copyToClipboard(textFromParts);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-upvote"
              className="text-muted-foreground !pointer-events-auto h-fit px-2 py-1"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={() => {
                const upvote = fetch("/api/ai/vote", {
                  method: "PATCH",
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: "up",
                  }),
                });

                toast.promise(upvote, {
                  loading: "Upvoting Response...",
                  success: () => {
                    void mutate<Vote[]>(
                      `/api/ai/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return [];

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id,
                        );

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: true,
                          },
                        ];
                      },
                      { revalidate: false },
                    );

                    return "Upvoted Response!";
                  },
                  error: "Failed to upvote response.",
                });
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              data-testid="message-downvote"
              className="text-muted-foreground !pointer-events-auto h-fit px-2 py-1"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={() => {
                const downvote = fetch("/api/ai/vote", {
                  method: "PATCH",
                  body: JSON.stringify({
                    chatId,
                    messageId: message.id,
                    type: "down",
                  }),
                });

                toast.promise(downvote, {
                  loading: "Downvoting Response...",
                  success: () => {
                    void mutate<Vote[]>(
                      `/api/ai/vote?chatId=${chatId}`,
                      (currentVotes) => {
                        if (!currentVotes) return [];

                        const votesWithoutCurrent = currentVotes.filter(
                          (vote) => vote.messageId !== message.id,
                        );

                        return [
                          ...votesWithoutCurrent,
                          {
                            chatId,
                            messageId: message.id,
                            isUpvoted: false,
                          },
                        ];
                      },
                      { revalidate: false },
                    );

                    return "Downvoted Response!";
                  },
                  error: "Failed to downvote response.",
                });
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);
