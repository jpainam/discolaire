"use client";

import { MailContent } from "./MailContent";
import { MailList } from "./MailList";
import { MailSidebar } from "./MailSidebar";

// Sample email data

export default function Page() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <MailSidebar />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Email List */}
        <MailList />

        {/* Email Detail or Compose View */}
        <MailContent />
      </div>
    </div>
  );
}
