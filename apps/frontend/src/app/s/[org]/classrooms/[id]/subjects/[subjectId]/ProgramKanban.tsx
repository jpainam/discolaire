"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CopyIcon, MoreVertical, Pencil, PlusIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Progress } from "@repo/ui/components/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "~/components/kanban";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateSubjectProgram } from "./CreateUpdateSubjectProgram";
import { Badge } from "./rich-badge";

interface SubjectProgramItem {
  id: string;
  title: string;
  coverage: number;
  description: string | null;
  requiredSessionCount: number;
  lastSession?: RouterOutputs["program"]["get"]["objectives"][number];
  categoryId: string;
}

interface SubjectProgramCardProps
  extends Omit<React.ComponentProps<typeof KanbanItem>, "value" | "children"> {
  subjectProgram: SubjectProgramItem;
  asHandle?: boolean;
}

function SubjectProgramCard({
  subjectProgram,
  asHandle,
  ...props
}: SubjectProgramCardProps) {
  const { openModal } = useModal();
  const t = useTranslations();
  const params = useParams<{ subjectId: string }>();
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
                <DropdownMenuItem>
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
                  {t("update")}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
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
            {/* <Avatar className="size-4">
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar> */}
            <span>Session</span>
            <Select
            // onValueChange={(value) => {
            //   alert(`Selected: ${value}`);
            // }}
            >
              <SelectTrigger
                size="sm"
                className="h-7 justify-start border-none shadow-none *:data-[slot=select-value]:w-fit"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">0</SelectItem>
                <SelectItem value="dark">1</SelectItem>
                <SelectItem value="system">2</SelectItem>
              </SelectContent>
            </Select>
            <span className="line-clamp-1">
              <Progress className="h-8 bg-red-500" value={50} />
            </span>
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

interface SubjectProgramColumnProps
  extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
  subjectPrograms: SubjectProgramItem[];
  categories: RouterOutputs["program"]["categories"];
  isOverlay?: boolean;
}

function SubjectProgramColumn({
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
      className="bg-secondary/30 rounded-md border p-2.5 shadow-xs"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold">
            {categories.find((cat) => cat.id == value)?.title}
          </span>
          <Badge variant="secondary">{subjectPrograms.length}</Badge>
        </div>
        <Button
          onClick={() => {
            const category = categories.find((cat) => cat.id == value);
            if (!category) return;
            openModal({
              title: t("create"),
              view: (
                <CreateUpdateSubjectProgram
                  categoryId={category.id}
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
          <SubjectProgramCard
            key={subjectProgram.id}
            subjectProgram={subjectProgram}
            asHandle={!isOverlay}
          />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

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
    subjectPrograms.forEach((program) => {
      const category = program.category.title;
      subjectGroups[category] ??= [];
      subjectGroups[category].push({
        id: program.id,
        title: program.title,
        coverage:
          (program.requiredSessionCount / program.objectives.length) * 100,
        description: program.description,
        requiredSessionCount: program.requiredSessionCount,
        lastSession: program.objectives.at(-1),
        categoryId: program.category.id,
      });
    });
    setColumns(subjectGroups);
  }, [subjectPrograms]);

  return (
    <div className="p-5">
      <Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id}
      >
        <KanbanBoard className="grid grid-cols-3 gap-2">
          {Object.entries(columns).map(([columnValue, subjectPrograms]) => (
            <SubjectProgramColumn
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
