"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";



import type { RouterOutputs } from "@repo/api";



import type { SubjectProgramItem } from "./program_kanban";
import { Kanban, KanbanBoard, KanbanOverlay } from "~/components/kanban";
import { useTRPC } from "~/trpc/react";
import { ProgramKanbanColumn } from "./ProgramKanbanColumn";


export function ProgramKanban({
  categories,
  defaultSubjectId,
}: {
  categories: RouterOutputs["program"]["categories"];
  defaultSubjectId: number
}) {
  const trpc = useTRPC();

  const [subjectId] = useQueryState("subjectId", parseAsInteger.withDefault(defaultSubjectId));
  const subjectProgramsQuery = useQuery(
    trpc.program.bySubject.queryOptions({
      subjectId: subjectId,
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
    subjectProgramsQuery.data?.forEach((program) => {
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
  }, [categories, subjectProgramsQuery.data]);

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