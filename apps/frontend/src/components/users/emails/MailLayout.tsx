import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "~/components/error-fallback";
import { caller } from "~/trpc/server";
import { MailContent } from "./MailContent";
import { MailContextProvider } from "./MailContextProvider";
import { MailList } from "./MailList";
import { MailSidebar } from "./MailSidebar";
export async function MailLayout({ userId }: { userId: string }) {
  const emails = await caller.email.all({
    userId: userId,
    limit: 100,
    offset: 0,
  });
  return (
    <MailContextProvider activeView={"inbox"} emails={emails}>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <MailSidebar />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Email List */}
          <MailList />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <MailContent />
          </ErrorBoundary>
        </div>
      </div>
    </MailContextProvider>
  );
}
