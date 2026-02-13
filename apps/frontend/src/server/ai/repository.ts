import "server-only";

import {
  createChat,
  createTRPCContext,
  getChatById,
  listChats,
  softDeleteAllChats,
  softDeleteChat,
  updateChatMessages,
  type ChatDetail,
  type ChatListItem,
  type ChatPageResult,
} from "@repo/api";
import { headers } from "next/headers";

import { getAuth } from "~/auth/server";
import { ChatSDKError } from "~/lib/errors";

interface AuthContext {
  db: Awaited<ReturnType<typeof createTRPCContext>>["db"];
  userId: string;
}

export type { ChatDetail, ChatListItem, ChatPageResult };
export {
  createChat,
  getChatById,
  listChats,
  softDeleteAllChats,
  softDeleteChat,
  updateChatMessages,
};

export async function getAiAuthContext(): Promise<AuthContext> {
  const headerList = new Headers(await headers());
  const auth = await getAuth(headerList);
  const trpcContext = await createTRPCContext({
    headers: headerList,
    auth,
  });
  const userId = trpcContext.session?.user.id;

  if (!userId) {
    throw new ChatSDKError("unauthorized:auth", "User is not authenticated.");
  }

  return { db: trpcContext.db, userId };
}
