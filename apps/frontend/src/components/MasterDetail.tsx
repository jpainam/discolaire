import type { ReactNode } from "react";

import { ScrollArea } from "~/components/ui/scroll-area";

interface MasterDetailProps {
  listHeader?: ReactNode;
  list: ReactNode;
  detail: ReactNode;
}

/**
 * Reusable master/detail layout that fills the remaining page height.
 *
 * Uses flex-row so both panels receive their height via cross-axis stretch
 * (more reliable than CSS grid `fr` units when the parent height comes from
 * `flex-1`). Each panel scrolls independently via ScrollArea.
 *
 * Requirements: every ancestor in the flex chain must carry `min-h-0` so
 * the bounded height propagates correctly (see Container.tsx and the
 * enclosing route layout).
 */
export function MasterDetail({ listHeader, list, detail }: MasterDetailProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col text-sm md:flex-row">
      {/* List panel */}
      <div className="flex min-h-0 flex-1 flex-col border-b md:border-r">
        {listHeader && (
          <div className="bg-muted/50 shrink-0 border-b">{listHeader}</div>
        )}
        <ScrollArea className="min-h-0 flex-1">{list}</ScrollArea>
      </div>

      {/* Detail panel */}
      <div className="flex min-h-0 flex-1 flex-col border-b">
        <ScrollArea className="min-h-0 flex-1">{detail}</ScrollArea>
      </div>
    </div>
  );
}
