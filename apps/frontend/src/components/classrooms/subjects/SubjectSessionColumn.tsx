"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Plus } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateSubjectSession } from "./CreateUpdateSubjectSession";
import { BacklogIcon } from "./statuses";
import { SubjectSessionCard } from "./SubjectSessionCard";

export function SubjectSessionColumn({
  term,
  subjectId,
}: {
  term: RouterOutputs["term"]["all"][number];
  subjectId: number;
}) {
  const StatusIcon = BacklogIcon;
  const trpc = useTRPC();
  const sessionsQuery = useQuery(
    trpc.subjectSession.sessions.queryOptions({ termId: term.id, subjectId }),
  );
  const sessions = sessionsQuery.data;
  const { openModal } = useModal();
  return (
    <div className="flex h-full w-[300px] flex-1 shrink-0 flex-col lg:w-[360px]">
      <div className="border-border bg-muted/70 dark:bg-muted/50 flex max-h-full flex-col rounded-lg border p-3">
        {/* Column header */}
        <div className="mb-2 flex items-center justify-between rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex size-4 items-center justify-center">
              <StatusIcon />
            </div>
            <span className="text-sm font-medium">{term.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => {
                openModal({
                  className:
                    "lg:max-w-screen-lg overflow-y-scroll max-h-screen",
                  view: <CreateUpdateSubjectSession subjectId={subjectId} />,
                });
              }}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <Plus className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>

        {/* Tasks list */}
        <div className="flex h-full flex-col gap-3 overflow-y-auto">
          {sessions?.map((sess, index) => (
            <SubjectSessionCard key={index} session={sess} />
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-background h-auto gap-2 self-start px-0 py-1 text-xs"
          >
            <Plus className="size-4" />
            <span>Add task</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
