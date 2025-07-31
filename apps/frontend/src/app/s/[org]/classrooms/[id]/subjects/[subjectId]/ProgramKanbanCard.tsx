"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon, MoreVertical, Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import type { SubjectProgramItem } from "./program_kanban";
import { KanbanItem, KanbanItemHandle } from "~/components/kanban";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateSubjectProgram } from "./CreateUpdateSubjectProgram";
import { Badge } from "./rich-badge";

interface SubjectProgramCardProps
  extends Omit<React.ComponentProps<typeof KanbanItem>, "value" | "children"> {
  subjectProgram: SubjectProgramItem;
  asHandle?: boolean;
}

export function ProgramKanbanCard({
  subjectProgram,
  asHandle,
  ...props
}: SubjectProgramCardProps) {
  const { openModal } = useModal();
  const t = useTranslations();
  const params = useParams<{ subjectId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const deleteSubjectProgram = useMutation(
    trpc.program.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.program.bySubject.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const cardContent = (
    <div className="bg-card rounded-md border px-2 py-1 shadow-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-xs font-medium">
            {subjectProgram.title}
          </span>
          <div className="flex items-center gap-1">
            <Badge
              variant={
                subjectProgram.coverage < 20
                  ? "destructive"
                  : subjectProgram.coverage < 75
                    ? "warning"
                    : "primary"
              }
              appearance="outline"
              className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-[11px] capitalize"
            >
              {subjectProgram.coverage}%
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-6">
                  <MoreVertical className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("create"),
                      view: (
                        <CreateUpdateSubjectProgram
                          title={subjectProgram.title}
                          description={subjectProgram.description}
                          requiredSessionCount={
                            subjectProgram.requiredSessionCount
                          }
                          categoryId={subjectProgram.categoryId}
                          subjectId={Number(params.subjectId)}
                        />
                      ),
                    });
                  }}
                >
                  <CopyIcon />
                  {t("copy")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("update"),
                      view: (
                        <CreateUpdateSubjectProgram
                          id={subjectProgram.id}
                          title={subjectProgram.title}
                          description={subjectProgram.description}
                          requiredSessionCount={
                            subjectProgram.requiredSessionCount
                          }
                          categoryId={subjectProgram.categoryId}
                          subjectId={Number(params.subjectId)}
                        />
                      ),
                    });
                  }}
                >
                  <Pencil />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      deleteSubjectProgram.mutate(subjectProgram.id);
                    }
                  }}
                  variant="destructive"
                >
                  <Trash />
                  {t("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {subjectProgram.description && (
          <div className="text-muted-foreground text-xs">
            {subjectProgram.description}
          </div>
        )}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            Sessions requis/effectuées:{" "}
            <Badge variant="secondary" appearance={"light"}>
              {subjectProgram.requiredSessionCount} /
              {subjectProgram.sessionsCount}{" "}
            </Badge>
            <span className="line-clamp-1"></span>
          </div>

          {subjectProgram.lastSession && (
            <time className="text-[10px] whitespace-nowrap tabular-nums">
              {JSON.stringify(subjectProgram.lastSession)}
            </time>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <KanbanItem value={subjectProgram.id} {...props}>
      {asHandle ? (
        <KanbanItemHandle>{cardContent}</KanbanItemHandle>
      ) : (
        cardContent
      )}
    </KanbanItem>
  );
}
