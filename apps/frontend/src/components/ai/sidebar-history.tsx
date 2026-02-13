"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";

import type { AiChatHistory, AiChatListItem } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "~/components/ui/sidebar";
import { fetcher } from "~/lib/utils";
import { ChatItem } from "./sidebar-history-item";

interface SidebarHistoryUser {
  id: string;
}

interface GroupedChats {
  today: AiChatListItem[];
  yesterday: AiChatListItem[];
  lastWeek: AiChatListItem[];
  lastMonth: AiChatListItem[];
  older: AiChatListItem[];
}

const PAGE_SIZE = 20;

const groupChatsByDate = (chats: AiChatListItem[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  );
};

export function getChatHistoryPaginationKey(
  pageIndex: number,
  previousPageData: AiChatHistory | null,
) {
  if (previousPageData?.hasMore === false) {
    return null;
  }

  if (pageIndex === 0) {
    return `/api/ai/history?limit=${PAGE_SIZE}`;
  }

  if (!previousPageData) {
    return null;
  }

  const lastChat = previousPageData.chats.at(-1);
  if (!lastChat) {
    return null;
  }

  return `/api/ai/history?ending_before=${lastChat.id}&limit=${PAGE_SIZE}`;
}

export function SidebarHistory({
  user,
}: {
  user: SidebarHistoryUser | undefined;
}) {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const activeChatId = pathname.startsWith("/ai/")
    ? pathname.split("/")[2]
    : null;

  const {
    data: paginatedChatHistories,
    setSize,
    isValidating,
    isLoading,
    mutate,
  } = useSWRInfinite<AiChatHistory>(getChatHistoryPaginationKey, fetcher, {
    fallbackData: [],
  });

  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const chatsFromHistory = useMemo(
    () =>
      paginatedChatHistories?.flatMap(
        (chatHistoryPage) => chatHistoryPage.chats,
      ) ?? [],
    [paginatedChatHistories],
  );

  const groupedChats = useMemo(
    () => groupChatsByDate(chatsFromHistory),
    [chatsFromHistory],
  );

  const hasReachedEnd = paginatedChatHistories
    ? paginatedChatHistories.some((page) => page.hasMore === false)
    : false;

  const hasEmptyChatHistory =
    paginatedChatHistories?.every((page) => page.chats.length === 0) ?? false;

  useEffect(() => {
    if (!loadMoreRef.current || hasReachedEnd) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isValidating) {
          void setSize((size) => size + 1);
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasReachedEnd, isValidating, setSize]);

  const handleDelete = () => {
    const chatToDelete = deleteId;

    if (!chatToDelete) {
      setShowDeleteDialog(false);
      return;
    }

    const isCurrentChat = pathname === `/ai/${chatToDelete}`;
    setShowDeleteDialog(false);

    const deletePromise = fetch(`/api/ai/chat/${chatToDelete}`, {
      method: "DELETE",
    });

    toast.promise(deletePromise, {
      loading: "Deleting chat...",
      success: async () => {
        await mutate((chatHistoryPages) => {
          if (!chatHistoryPages) {
            return chatHistoryPages;
          }

          return chatHistoryPages.map((chatHistoryPage) => ({
            ...chatHistoryPage,
            chats: chatHistoryPage.chats.filter(
              (chat) => chat.id !== chatToDelete,
            ),
          }));
        });

        if (isCurrentChat) {
          router.replace("/ai");
          router.refresh();
        }

        return "Chat deleted successfully";
      },
      error: "Failed to delete chat",
    });
  };

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            Login to save and revisit previous chats.
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
          Today
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                className="flex h-8 items-center gap-2 rounded-md px-2"
                key={item}
              >
                <div
                  className="bg-sidebar-accent-foreground/10 h-4 max-w-(--skeleton-width) flex-1 rounded-md"
                  style={{ "--skeleton-width": `${item}%` } as CSSProperties}
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (hasEmptyChatHistory) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            Your conversations will appear here once you start chatting.
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <div className="flex flex-col gap-6">
              {groupedChats.today.length > 0 && (
                <div>
                  <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
                    Today
                  </div>
                  {groupedChats.today.map((chat) => (
                    <ChatItem
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      key={chat.id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}

              {groupedChats.yesterday.length > 0 && (
                <div>
                  <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
                    Yesterday
                  </div>
                  {groupedChats.yesterday.map((chat) => (
                    <ChatItem
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      key={chat.id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}

              {groupedChats.lastWeek.length > 0 && (
                <div>
                  <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
                    Last 7 days
                  </div>
                  {groupedChats.lastWeek.map((chat) => (
                    <ChatItem
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      key={chat.id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}

              {groupedChats.lastMonth.length > 0 && (
                <div>
                  <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
                    Last 30 days
                  </div>
                  {groupedChats.lastMonth.map((chat) => (
                    <ChatItem
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      key={chat.id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}

              {groupedChats.older.length > 0 && (
                <div>
                  <div className="text-sidebar-foreground/50 px-2 py-1 text-xs">
                    Older
                  </div>
                  {groupedChats.older.map((chat) => (
                    <ChatItem
                      chat={chat}
                      isActive={chat.id === activeChatId}
                      key={chat.id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}
            </div>
          </SidebarMenu>

          <div ref={loadMoreRef} />

          {hasReachedEnd ? (
            <div className="mt-8 flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
              You have reached the end of your chat history.
            </div>
          ) : (
            <div className="mt-8 flex flex-row items-center gap-2 p-2 text-zinc-500">
              <Loader2Icon className="size-4 animate-spin" />
              <div>Loading chats...</div>
            </div>
          )}
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The chat will be removed from your
              history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
