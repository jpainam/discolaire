"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Plus } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateSubjectSession } from "./CreateUpdateSubjectSession";
import {
  BacklogIcon,
  CompletedIcon,
  InProgressIcon,
  PausedIcon,
} from "./statuses";
import { SubjectSessionCard } from "./SubjectSessionCard";

const getStatusIcon = (term: RouterOutputs["term"]["all"][number]) => {
  const today = new Date();
  if (term.startDate < today && term.endDate > today) {
    return InProgressIcon;
  }
  if (term.startDate > today) {
    return BacklogIcon;
  }
  if (term.endDate < today) {
    return CompletedIcon;
  }
  return PausedIcon;
};
export function SubjectSessionColumn({
  term,
  subjectId,
  className,
}: {
  term: RouterOutputs["term"]["all"][number];
  subjectId: number;
  className?: string;
}) {
  const StatusIcon = getStatusIcon(term);
  const trpc = useTRPC();
  const programsQuery = useQuery(
    trpc.subjectProgram.programs.queryOptions({ termId: term.id, subjectId }),
  );
  const programs = programsQuery.data;
  const { openModal } = useModal();
  {
    /* <div className="flex h-full w-[300px] flex-1 shrink-0 flex-col  lg:w-[360px]"> */
  }
  return (
    <div className={cn("flex shrink-0 flex-col", className)}>
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
          {programs?.map((program, index) => (
            <SubjectSessionCard key={index} program={program} />
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
