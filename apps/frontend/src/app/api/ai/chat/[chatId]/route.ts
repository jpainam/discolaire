import { NextResponse } from "next/server";
import type { UIMessage } from "ai";
import { z } from "zod/v4";

import { ChatSDKError } from "~/lib/errors";
import { deriveChatTitle } from "~/server/ai/messages";
import { resolveAiRuntimeConfig } from "~/server/ai/provider";
import {
  getAiAuthContext,
  getChatById,
  softDeleteChat,
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
  messages: z.array(uiMessageSchema),
  provider: z.string().optional(),
  model: z.string().optional(),
});

interface RouteContext {
  params: Promise<{ chatId: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { chatId } = await context.params;
    const { db, userId } = await getAiAuthContext();
    const chat = await getChatById(db, userId, chatId);

    if (!chat) {
      return new ChatSDKError("not_found:chat").toResponse();
    }

    return NextResponse.json(chat);
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error(error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { chatId } = await context.params;
    const parsed = bodySchema.safeParse(await request.json());

    if (!parsed.success) {
      return new ChatSDKError("bad_request:api", "Invalid body payload.").toResponse();
    }

    const { db, userId } = await getAiAuthContext();
    const messages = parsed.data.messages as unknown as UIMessage[];
    const runtimeConfig = resolveAiRuntimeConfig({
      provider: parsed.data.provider,
      model: parsed.data.model,
    });

    const chat = await updateChatMessages(db, {
      userId,
      chatId,
      messages,
      provider: runtimeConfig.provider,
      model: runtimeConfig.model,
      title: deriveChatTitle(messages),
    });

    if (!chat) {
      return new ChatSDKError("not_found:chat").toResponse();
    }

    return NextResponse.json(chat);
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error(error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { chatId } = await context.params;
    const { db, userId } = await getAiAuthContext();
    await softDeleteChat(db, { userId, chatId });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error(error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
