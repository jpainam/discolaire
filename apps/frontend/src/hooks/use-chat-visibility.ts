/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";

import { VisibilityType } from "@repo/db/enums";

import type { ChatHistory } from "~/components/ai/sidebar-history";
import { updateChatVisibility } from "~/components/ai/actions";
import { getChatHistoryPaginationKey } from "~/components/ai/sidebar-history";

export function useChatVisibility({
  chatId,
  initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history = cache.get("/api/ai/history")?.data as ChatHistory | undefined;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibilityType,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility as VisibilityType;
    const chat = history.chats.find((chat) => chat.id === chatId);
    if (!chat) return VisibilityType.PRIVATE;
    return chat.visibility;
  }, [history, chatId, localVisibility]);

  const setVisibilityType = async (updatedVisibilityType: VisibilityType) => {
    await setLocalVisibility(updatedVisibilityType);
    await mutate(unstable_serialize(getChatHistoryPaginationKey));

    await updateChatVisibility({
      chatId: chatId,
      visibility: updatedVisibilityType,
    });
  };

  return { visibilityType, setVisibilityType };
}
