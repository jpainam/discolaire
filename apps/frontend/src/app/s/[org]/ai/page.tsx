import { cookies } from "next/headers";

import { VisibilityType } from "@repo/db";
import { redirect } from "next/navigation";
import { getSession } from "~/auth/server";
import { Chat } from "~/components/ai/chat";
import { DataStreamHandler } from "~/components/ai/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "~/lib/ai/models";
import { generateUUID } from "~/lib/utils";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/guest");
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType={VisibilityType.PRIVATE}
          isReadonly={false}
          session={session}
          autoResume={false}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value}
        initialVisibilityType={VisibilityType.PRIVATE}
        isReadonly={false}
        session={session}
        autoResume={false}
      />
      <DataStreamHandler />
    </>
  );
}
