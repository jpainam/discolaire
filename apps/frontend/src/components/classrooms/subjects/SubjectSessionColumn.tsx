"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, MoreHorizontal, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateUpdateSubjectSession } from "./CreateUpdateSubjectSession";
import {
  BacklogIcon,
  CompletedIcon,
  InProgressIcon,
  PausedIcon,
} from "./statuses";
import { SubjectSessionCard } from "./SubjectSessionCard";

export function SubjectSessionColumn({
  term,
  subjectId,
  className,
}: {
  term: RouterOutputs["term"]["all"][number];
  subjectId: number;
  className?: string;
}) {
  const getStatusIcon = (term: RouterOutputs["term"]["all"][number]) => {
    const today = new Date();
    if (term.startDate < today && term.endDate > today) {
      return <InProgressIcon />;
    }
    if (term.startDate > today) {
      return <BacklogIcon />;
    }
    if (term.endDate < today) {
      return <CompletedIcon />;
    }
    return <PausedIcon />;
  };

  const trpc = useTRPC();
  const programsQuery = useQuery(
    trpc.subjectProgram.programs.queryOptions({ termId: term.id, subjectId }),
  );
  const subjectQuery = useQuery(trpc.subject.get.queryOptions(subjectId));
  const programs = programsQuery.data;
  const { openModal } = useModal();
  const t = useTranslations();
  const subject = subjectQuery.data;

  const canCreateProgram = useCheckPermission("program", "create");

  return (
    <div className={cn("flex shrink-0 flex-col", className)}>
      <div className="border-border bg-muted/70 dark:bg-muted/50 flex max-h-full flex-col rounded-lg border p-3">
        {/* Column header */}
        <div className="mb-2 flex items-center justify-between rounded-lg">
          <div className="flex items-center gap-2">
            <div className="flex size-4 items-center justify-center">
              {getStatusIcon(term)}
            </div>
            <span className="text-sm font-medium">{term.name}</span>
          </div>
          <div className="flex items-center gap-1">
            {canCreateProgram && (
              <Button
                onClick={() => {
                  openModal({
                    // className:
                    //   "lg:max-w-screen-lg overflow-y-scroll max-h-screen",
                    title: `Programme ${subject?.course.name}`,
                    description: `${subject?.teacher?.prefix} ${getFullName(subject?.teacher)}`,
                    view: (
                      <CreateUpdateSubjectSession
                        termId={term.id}
                        subjectId={subjectId}
                      />
                    ),
                  });
                }}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Plus className="size-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>

        {/* Tasks list */}
        <div className="flex h-full flex-col gap-3 overflow-y-auto">
          {programsQuery.isPending && (
            <div className="flex justify-center">
              {Array.from({ length: 1 }).map((_, index) => (
                <Loader2Icon key={index} className="h-5 w-5 animate-spin" />
              ))}
            </div>
          )}
          {programs?.map((program, index) => (
            <SubjectSessionCard key={index} program={program} />
          ))}

          {canCreateProgram && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                openModal({
                  // className: "lg:max-w-screen-lg overflow-y-scroll max-h-screen",
                  title: `Programme ${subject?.course.name}`,
                  description: `${subject?.teacher?.prefix} ${getFullName(subject?.teacher)}`,
                  view: (
                    <CreateUpdateSubjectSession
                      termId={term.id}
                      subjectId={subjectId}
                    />
                  ),
                });
              }}
              className="hover:bg-background h-auto gap-2 self-start px-0 py-1 text-xs"
            >
              <Plus className="size-4" />
              <span>{t("Add program")}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
