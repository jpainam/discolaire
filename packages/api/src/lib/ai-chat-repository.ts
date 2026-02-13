import type { Prisma, PrismaClient } from "@repo/db";

const chatSelect = {
  id: true,
  userId: true,
  title: true,
  messages: true,
  provider: true,
  model: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.AiChatSelect;

type ChatRecord = Prisma.AiChatGetPayload<{ select: typeof chatSelect }>;

export interface ChatListItem {
  id: string;
  title: string;
  createdAt: string;
}

export interface ChatPageResult {
  chats: ChatListItem[];
  hasMore: boolean;
}

export interface ChatDetail {
  id: string;
  title: string;
  provider: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages: unknown[];
}

function toMessageArray(value: Prisma.JsonValue): unknown[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value;
}

function toChatDetail(row: ChatRecord): ChatDetail {
  return {
    id: row.id,
    title: row.title,
    provider: row.provider,
    model: row.model,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    messages: toMessageArray(row.messages),
  };
}

export async function getChatById(
  db: PrismaClient,
  userId: string,
  chatId: string,
): Promise<ChatDetail | null> {
  const row = await db.aiChat.findFirst({
    where: {
      id: chatId,
      userId,
      deletedAt: null,
    },
    select: chatSelect,
  });

  return row ? toChatDetail(row) : null;
}

export async function createChat(
  db: PrismaClient,
  params: {
    userId: string;
    title: string;
    provider: string;
    model: string;
    messages: unknown[];
  },
): Promise<ChatDetail> {
  const row = await db.aiChat.create({
    data: {
      userId: params.userId,
      title: params.title,
      provider: params.provider,
      model: params.model,
      messages: params.messages as Prisma.InputJsonValue,
    },
    select: chatSelect,
  });

  return toChatDetail(row);
}

export async function updateChatMessages(
  db: PrismaClient,
  params: {
    userId: string;
    chatId: string;
    title: string;
    provider: string;
    model: string;
    messages: unknown[];
  },
): Promise<ChatDetail | null> {
  const updated = await db.aiChat.updateMany({
    where: {
      userId: params.userId,
      id: params.chatId,
      deletedAt: null,
    },
    data: {
      title: params.title,
      provider: params.provider,
      model: params.model,
      messages: params.messages as Prisma.InputJsonValue,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  return getChatById(db, params.userId, params.chatId);
}

export async function listChats(
  db: PrismaClient,
  params: {
    userId: string;
    limit: number;
    endingBefore?: string;
  },
): Promise<ChatPageResult> {
  const safeLimit = Math.min(Math.max(params.limit, 1), 50);
  const where: Prisma.AiChatWhereInput = {
    userId: params.userId,
    deletedAt: null,
  };

  if (params.endingBefore) {
    const cursorChat = await db.aiChat.findFirst({
      where: {
        id: params.endingBefore,
        userId: params.userId,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    if (!cursorChat) {
      return {
        chats: [],
        hasMore: false,
      };
    }

    where.OR = [
      {
        createdAt: {
          lt: cursorChat.createdAt,
        },
      },
      {
        createdAt: cursorChat.createdAt,
        id: {
          lt: cursorChat.id,
        },
      },
    ];
  }

  const rows = await db.aiChat.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: safeLimit + 1,
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });

  const hasMore = rows.length > safeLimit;
  const pageRows = hasMore ? rows.slice(0, safeLimit) : rows;

  return {
    chats: pageRows.map((row) => ({
      id: row.id,
      title: row.title,
      createdAt: row.createdAt.toISOString(),
    })),
    hasMore,
  };
}

export async function softDeleteChat(
  db: PrismaClient,
  params: {
    userId: string;
    chatId: string;
  },
) {
  await db.aiChat.updateMany({
    where: {
      userId: params.userId,
      id: params.chatId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function softDeleteAllChats(db: PrismaClient, userId: string) {
  await db.aiChat.updateMany({
    where: {
      userId,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}
