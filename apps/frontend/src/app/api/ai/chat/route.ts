import { streamText } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod/v4";

import { ChatSDKError } from "~/lib/errors";
import { deriveChatTitle, toCoreMessages } from "~/server/ai/messages";
import { getLanguageModel, resolveAiRuntimeConfig } from "~/server/ai/provider";
import {
  createChat,
  getAiAuthContext,
  getChatById,
  updateChatMessages,
} from "~/server/ai/repository";

const uiMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(z.object({ type: z.string() }).passthrough()),
  })
  .passthrough();

const bodySchema = z.object({
  chatId: z.string().min(1).optional(),
  messages: z.array(uiMessageSchema),
  provider: z.string().optional(),
  model: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = bodySchema.safeParse(await request.json());

    if (!parsed.success) {
      return new ChatSDKError("bad_request:api", "Invalid body payload.").toResponse();
    }

    const messages = parsed.data.messages as unknown as UIMessage[];
    const coreMessages = toCoreMessages(messages);

    if (coreMessages.length === 0) {
      return new ChatSDKError("bad_request:api", "Chat messages are empty.").toResponse();
    }

    const runtimeConfig = resolveAiRuntimeConfig({
      provider: parsed.data.provider,
      model: parsed.data.model,
    });

    const { db, userId } = await getAiAuthContext();
    const title = deriveChatTitle(messages);
    let chatId = parsed.data.chatId;

    if (chatId) {
      const existingChat = await getChatById(db, userId, chatId);

      if (!existingChat) {
        return new ChatSDKError("not_found:chat").toResponse();
      }

      await updateChatMessages(db, {
        userId,
        chatId,
        title,
        provider: runtimeConfig.provider,
        model: runtimeConfig.model,
        messages,
      });
    } else {
      const createdChat = await createChat(db, {
        userId,
        title,
        provider: runtimeConfig.provider,
        model: runtimeConfig.model,
        messages,
      });
      chatId = createdChat.id;
    }

    const result = streamText({
      model: getLanguageModel(runtimeConfig),
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "x-ai-chat-id": chatId,
      },
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error(error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
