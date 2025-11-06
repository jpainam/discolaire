"use client";

import {
  Calendar,
  CheckCircle,
  FileText,
  Hexagon,
  InfoIcon,
  Link,
  MessageSquare,
  Stars,
} from "lucide-react";
import { useLocale } from "next-intl";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

import type { RouterOutputs } from "@repo/api";
import { PriorityEnum } from "@repo/db/enums";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";

import "react-circular-progressbar/dist/styles.css";

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

  return (
    <div className="bg-background border-border shrink-0 overflow-hidden rounded-lg border">
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
          {program.priority === PriorityEnum.URGENT && !isCompleted && (
            <Stars className="size-4 shrink-0 text-pink-500" />
          )}
          {program.priority === PriorityEnum.HIGH && !isCompleted && (
            <InfoIcon className="size-4 shrink-0 text-red-500" />
          )}
          {program.priority === PriorityEnum.MEDIUM && !isCompleted && (
            <Hexagon className="size-4 shrink-0 text-cyan-500" />
          )}
          {isCompleted && (
            <CheckCircle className="size-4 shrink-0 text-green-500" />
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">
          {program.description}
        </p>

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

            {hasProgress && (
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
