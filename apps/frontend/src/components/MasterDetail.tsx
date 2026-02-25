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
    <div className="flex flex-1 min-h-0 flex-col md:flex-row text-sm">
      {/* List panel */}
      <div className="flex flex-1 min-h-0 flex-col border-b md:border-r">
        {listHeader && (
          <div className="shrink-0 bg-muted/50 border-b">{listHeader}</div>
        )}
        <ScrollArea className="flex-1 min-h-0">{list}</ScrollArea>
      </div>

      {/* Detail panel */}
      <div className="flex flex-1 min-h-0 flex-col border-b">
        <ScrollArea className="flex-1 min-h-0">{detail}</ScrollArea>
      </div>
    </div>
  );
}
