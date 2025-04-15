import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "~/components/error-fallback";
import { MailContent } from "./MailContent";
import { MailList } from "./MailList";
import { MailSidebar } from "./MailSidebar";

export default function Page() {
  return (
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
  );
}
