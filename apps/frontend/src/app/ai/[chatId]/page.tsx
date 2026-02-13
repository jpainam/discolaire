import { ChatView } from "~/components/ai/chat-view";

interface PageProps {
  params: Promise<{ chatId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { chatId } = await params;

  return <ChatView chatId={chatId} />;
}
