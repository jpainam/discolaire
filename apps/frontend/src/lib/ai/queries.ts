/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only";

import type { AiSuggestion, User, VisibilityType } from "@repo/db";
import { db, DocumentKind } from "@repo/db";
import type { ArtifactKind } from "~/components/ai/artifact";

import { ChatSDKError } from "../errors";

export async function getUser(email: string): Promise<User> {
  try {
    return await db.user.findFirstOrThrow({
      where: { email },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email",
    );
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    return await db.aiChat.create({
      data: { userId, title, visibility },
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.vote.deleteMany({ where: { chatId: id } });

    await db.aiMessage.deleteMany({ where: { chatId: id } });
    await db.stream.deleteMany({ where: { chatId: id } });
    return await db.aiChat.delete({
      where: { id },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id",
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;
    let filteredChats = [];
    if (startingAfter) {
      const selectedChat = await db.aiChat.findUnique({
        where: { id: startingAfter },
      });
      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`,
        );
      }
      filteredChats = await db.aiChat.findMany({
        where: {
          userId: id,
          createdAt: { gt: selectedChat.createdAt },
        },
        orderBy: { createdAt: "desc" },
        take: extendedLimit,
      });
    } else if (endingBefore) {
      const selectedChat = await db.aiChat.findUnique({
        where: { id: endingBefore },
      });
      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`,
        );
      }
      filteredChats = await db.aiChat.findMany({
        where: {
          userId: id,
          createdAt: { lt: selectedChat.createdAt },
        },
        orderBy: { createdAt: "desc" },
        take: extendedLimit,
      });
    } else {
      filteredChats = await db.aiChat.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        take: extendedLimit,
      });
    }
    const hasMore = filteredChats.length > limit;
    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id",
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    return await db.aiChat.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

export async function saveMessages({
  messages,
}: {
  messages: {
    chatId: string;
    role: string;
    parts: string[];
    attachments: string[];
  }[];
}) {
  try {
    return db.aiMessage.createMany({
      data: messages,
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return db.aiMessage.findMany({
      orderBy: { createdAt: "asc" },
      where: { chatId: id },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id",
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const existingVote = await db.vote.findFirst({
      where: {
        messageId,
      },
    });

    if (existingVote) {
      return db.vote.update({
        data: {
          isUpvoted: type === "up",
        },
        where: {
          chatId_messageId: {
            chatId,
            messageId,
          },
        },
      });
    }
    return db.vote.create({
      data: {
        chatId,
        messageId,
        isUpvoted: type === "up",
      },
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return db.vote.findMany({
      where: { chatId: id },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id",
    );
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return db.aiDocument.create({
      data: {
        title,
        kind:
          kind == "sheet"
            ? DocumentKind.SHEET
            : kind == "image"
              ? DocumentKind.IMAGE
              : kind == "code"
                ? DocumentKind.CODE
                : DocumentKind.TEXT,
        content,
        userId,
      },
    });
  } catch (error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    return db.aiDocument.findMany({
      where: { id },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id",
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    return db.aiDocument.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id",
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db.aiSuggestion.deleteMany({
      where: {
        documentId: id,
        documentCreatedAt: { gt: timestamp },
      },
    });
    return db.aiDocument.deleteMany({
      where: {
        id,
        createdAt: { gt: timestamp },
      },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp",
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: AiSuggestion[];
}) {
  try {
    return db.aiSuggestion.createMany({
      data: suggestions,
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions",
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return db.aiSuggestion.findMany({
      where: { documentId },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id",
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return db.aiMessage.findUniqueOrThrow({
      where: { id },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id",
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db.aiMessage.findMany({
      select: { id: true },
      where: {
        chatId,
        createdAt: { gte: timestamp },
      },
    });

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db.vote.deleteMany({
        where: {
          chatId,
          messageId: { in: messageIds },
        },
      });
      return await db.aiMessage.deleteMany({
        where: {
          chatId,
          id: { in: messageIds },
        },
      });
    }
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp",
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  try {
    return db.aiChat.update({
      data: {
        visibility,
      },
      where: { id: chatId },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id",
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000,
    );
    const stats = await db.aiMessage.aggregate({
      _count: true,
      where: {
        chat: {
          userId: id,
        },
        createdAt: {
          gte: twentyFourHoursAgo,
        },
        role: "user",
      },
    });
    return stats._count;
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id",
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await db.stream.create({
      data: { id: streamId, chatId },
    });
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id",
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const streamIds = await db.stream.findMany({
      select: { id: true },
      orderBy: { createdAt: "asc" },
      where: { chatId },
    });

    return streamIds.map(({ id }) => id);
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id",
    );
  }
}
