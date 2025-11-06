"use client";

import {
  Calendar,
  CheckCircle,
  FileText,
  Link,
  MessageSquare,
  MoreVertical,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

import type { RouterOutputs } from "@repo/api";
import { PriorityEnum } from "@repo/db/enums";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import "react-circular-progressbar/dist/styles.css";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateUpdateSubjectSession } from "./CreateUpdateSubjectSession";
import { BacklogIcon } from "./statuses";

export function SubjectSessionCard({
  program,
}: {
  program: RouterOutputs["subjectProgram"]["programs"][number];
}) {
  const sum = (a: number[]) => {
    return a.reduce((a, b) => a + b, 0);
  };
  const StatusIcon = BacklogIcon; //task.status.icon;
  const hasProgress = program.journals.length > 0;

  const sessionDone = sum(program.journals.map((j) => j.sessionCount));
  const isCompleted =
    program.isCompleted ||
    (sessionDone == program.requiredSessionCount && hasProgress);
  const locale = useLocale();
  const t = useTranslations();
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const deleteSubjectSessionMutation = useMutation(
    trpc.subjectProgram.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectProgram.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const { openModal } = useModal();
  const term = program.term;
  const subject = program.subject;

  return (
    <div className="bg-background group border-border shrink-0 overflow-hidden rounded-lg border">
      {/* Main content */}
      <div className="px-3 py-2.5">
        {/* Title with status icon */}
        <div className="mb-2 flex items-center gap-2">
          <div className="bg-muted mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm p-1">
            <StatusIcon />
          </div>
          <h3 className="flex-1 text-sm leading-tight font-medium">
            {program.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="invisible size-7 opacity-0 transition group-hover:visible group-hover:opacity-100"
              asChild
            >
              <Button variant={"ghost"} className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("details")}</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    // className: "lg:max-w-screen-lg overflow-y-scroll max-h-screen",
                    title: `Programme ${subject.course.name}`,
                    description: `${subject.teacher?.prefix} ${getFullName(subject.teacher)}`,
                    view: (
                      <CreateUpdateSubjectSession
                        termId={term.id}
                        program={program}
                        subjectId={program.subjectId}
                      />
                    ),
                  });
                }}
              >
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  const isConfirm = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirm) {
                    toast.loading(t("Processing"), { id: 0 });
                    deleteSubjectSessionMutation.mutate(program.id);
                  }
                }}
                variant="destructive"
              >
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
          {program.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className={cn(
              "px-1.5 py-0.5 text-[10px] font-medium",
              program.priority == PriorityEnum.LOW &&
                "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
              program.priority == PriorityEnum.URGENT &&
                "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400",
              program.priority == PriorityEnum.MEDIUM &&
                "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
              program.priority == PriorityEnum.HIGH &&
                "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
            )}
          >
            {t(program.priority)}
          </Badge>
        </div>

        {/* Labels */}
        {/* {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.labels.map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-medium",
                  label.color,
                )}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        )} */}
      </div>

      {/* Footer with metadata */}
      <div className="border-border border-t border-dashed px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left side - metadata */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
            <div className="border-border flex items-center gap-1.5 rounded-sm border px-2 py-1">
              <Calendar className="size-3" />
              <span>
                {program.updatedAt.toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            {/* comments */}

            <div className="border-border flex items-center gap-1.5 rounded-sm border px-2 py-1">
              <MessageSquare className="size-3" />
              <span>{program.journals.length}</span>
            </div>

            <div className="border-border flex items-center gap-1.5 rounded-sm border px-2 py-1">
              <FileText className="size-3" />
              <span>{program.journals.filter((j) => j.attachment).length}</span>
            </div>

            <div className="border-border flex items-center gap-1.5 rounded-sm border px-2 py-1">
              <Link className="size-3" />
              <span>0</span>
            </div>

            {program.requiredSessionCount > 0 && (
              <div className="border-border flex items-center gap-1.5 rounded-sm border px-2 py-1">
                {isCompleted ? (
                  <CheckCircle className="size-3 text-green-500" />
                ) : (
                  <div className="size-3">
                    <CircularProgressbar
                      value={(sessionDone / program.requiredSessionCount) * 100}
                      strokeWidth={12}
                      styles={buildStyles({
                        pathColor: "#10b981",
                        trailColor: "#EDEDED",
                        strokeLinecap: "round",
                      })}
                    />
                  </div>
                )}
                <span>
                  {sessionDone}/{program.requiredSessionCount}
                </span>
              </div>
            )}
          </div>

          {/* Right side - avatars */}

          <div className="flex -space-x-2">
            <Avatar className="border-background size-5 border-2">
              <AvatarImage
                src={program.createdBy.avatar ?? undefined}
                alt={program.createdBy.name}
              />
              <AvatarFallback className="text-[10px]">
                {program.createdBy.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
