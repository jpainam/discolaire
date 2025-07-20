/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { VisibilityType } from "@repo/db";

import { getSession } from "~/auth/server";
import { Chat } from "~/components/ai/chat";
import { DataStreamHandler } from "~/components/ai/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "~/lib/ai/models";
import { getChatById, getMessagesByChatId } from "~/lib/ai/queries";
import { convertToUIMessages } from "~/lib/utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (chat.visibility === VisibilityType.PRIVATE) {
    if (!session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={uiMessages}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
          session={session}
          autoResume={true}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={uiMessages}
        initialChatModel={chatModelFromCookie.value}
        initialVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
        session={session}
        autoResume={true}
      />
      <DataStreamHandler />
    </>
  );
}
