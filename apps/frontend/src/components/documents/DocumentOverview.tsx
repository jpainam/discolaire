"use client";

import { DocumentFileList } from "./DocumentFileList";
import { DocumentRecentActivity } from "./DocumentRecentActivity";
import { DocumentSharedWithMe } from "./DocumentSharedWithMe";
import { DocumentStorageCard } from "./DocumentStorageCard";
import { DocumentStorageOverview } from "./DocumentStorageOverview";

export type ViewType =
  | "all"
  | "starred"
  | "recent"
  | "shared"
  | "trash"
  | "folder";

export function DocumentOverview() {
  return (
    <div className="w-full flex-1 overflow-auto">
      <div className="flex flex-col gap-4 p-2 md:p-2 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <DocumentStorageCard />

          <DocumentFileList />
        </div>

        <div className="w-full shrink-0 space-y-4 xl:w-80">
          <DocumentStorageOverview />
          <DocumentSharedWithMe />
          <DocumentRecentActivity />
        </div>
      </div>
    </div>
  );
}
