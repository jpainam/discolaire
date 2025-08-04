"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "@repo/api";

import type { SubjectProgramItem } from "./program_kanban";
import { Kanban, KanbanBoard, KanbanOverlay } from "~/components/kanban";
import { useTRPC } from "~/trpc/react";
import { ProgramKanbanColumn } from "./ProgramKanbanColumn";

export function ProgramKanban({
  categories,
}: {
  categories: RouterOutputs["program"]["categories"];
}) {
  const trpc = useTRPC();
  const params = useParams<{ subjectId: string }>();
  const { data: subjectPrograms } = useSuspenseQuery(
    trpc.program.bySubject.queryOptions({
      subjectId: Number(params.subjectId),
    }),
  );
  const [columns, setColumns] = React.useState<
    Record<string, SubjectProgramItem[]>
  >({});

  React.useEffect(() => {
    const subjectGroups: Record<string, SubjectProgramItem[]> = {};
    categories.forEach((category) => {
      subjectGroups[category.id] = [];
    });
    subjectPrograms.forEach((program) => {
      const categoryId = program.category.id;
      subjectGroups[categoryId] ??= [];
      subjectGroups[categoryId].push({
        id: program.id,
        title: program.title,
        sessionsCount: program.teachingSessions.length,
        coverage:
          program.teachingSessions.length == 0
            ? 0
            : (program.requiredSessionCount / program.teachingSessions.length) *
              100,
        description: program.description,
        requiredSessionCount: program.requiredSessionCount,
        lastSession: program.teachingSessions.at(-1),
        categoryId: program.category.id,
      });
    });
    setColumns(subjectGroups);
  }, [categories, subjectPrograms]);

  return (
    <div className="px-4">
      <Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id}
      >
        <KanbanBoard className="grid grid-cols-3 gap-2">
          {Object.entries(columns).map(([columnValue, subjectPrograms]) => (
            <ProgramKanbanColumn
              key={columnValue}
              categories={categories}
              value={columnValue}
              subjectPrograms={subjectPrograms}
            />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          <div className="bg-muted/60 size-full rounded-md" />
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
