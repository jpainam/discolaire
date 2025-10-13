"use client";

import type * as React from "react";
import { useParams } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import type { SubjectProgramItem } from "./program_kanban";
import { KanbanColumn, KanbanColumnContent } from "~/components/kanban";
import { useModal } from "~/hooks/use-modal";
import { CreateUpdateSubjectProgram } from "./CreateUpdateSubjectProgram";
import { ProgramKanbanCard } from "./ProgramKanbanCard";

interface SubjectProgramColumnProps
  extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
  subjectPrograms: SubjectProgramItem[];
  categories: RouterOutputs["program"]["categories"];
  isOverlay?: boolean;
}

export function ProgramKanbanColumn({
  value,
  subjectPrograms,
  categories,
  isOverlay,
  ...props
}: SubjectProgramColumnProps) {
  const { openModal } = useModal();
  const t = useTranslations();
  const params = useParams<{ subjectId: string }>();
  return (
    <KanbanColumn
      value={value}
      {...props}
      className="bg-secondary/20 rounded-md border p-2 shadow-xs"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="h-[8px] w-[40px] rounded-sm"
            style={{
              backgroundColor: categories.find((cat) => cat.id == value)?.color,
            }}
          />
          <span className="text-sm font-semibold">
            {categories.find((cat) => cat.id == value)?.title}
          </span>
          {/* <Badge variant="secondary">{subjectPrograms.length}</Badge> */}
        </div>
        <Button
          onClick={() => {
            const category = categories.find((cat) => cat.id == value);
            if (!category) return;
            openModal({
              title: t("create"),
              view: (
                <CreateUpdateSubjectProgram
                  description={null}
                  categoryId={category.id}
                  requiredSessionCount={1}
                  subjectId={Number(params.subjectId)}
                />
              ),
            });
          }}
          variant={"ghost"}
          className="size-7"
          size="icon"
        >
          <PlusIcon />
        </Button>
        {/* <KanbanColumnHandle asChild>
          <Button variant="secondary" size="sm">
            <GripVertical />
          </Button>
        </KanbanColumnHandle> */}
      </div>
      <KanbanColumnContent
        value={value}
        className="flex flex-col gap-2.5 p-0.5"
      >
        {subjectPrograms.map((subjectProgram) => (
          <ProgramKanbanCard
            key={subjectProgram.id}
            subjectProgram={subjectProgram}
            asHandle={!isOverlay}
          />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}
