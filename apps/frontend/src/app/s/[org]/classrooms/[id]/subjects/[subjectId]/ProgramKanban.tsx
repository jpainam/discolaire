"use client";

import * as React from "react";
import { CopyIcon, MoreVertical, Pencil, PlusIcon, Trash } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
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

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  description?: string;
  assignee?: string;
  assigneeAvatar?: string;
  dueDate?: string;
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  review: "Review",
  done: "Done",
  done1: "Done",
  done2: "Done",
};

interface TaskCardProps
  extends Omit<React.ComponentProps<typeof KanbanItem>, "value" | "children"> {
  task: Task;
  asHandle?: boolean;
}

function TaskCard({ task, asHandle, ...props }: TaskCardProps) {
  const cardContent = (
    <div className="bg-card rounded-md border px-2 py-1 shadow-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-xs font-medium">{task.title}</span>
          <div className="flex items-center gap-1">
            <Badge
              variant={"secondary"}
              // variant={
              //   task.priority === "high"
              //     ? "destructive"
              //     : task.priority === "medium"
              //       ? "primary"
              //       : "warning"
              // }
              // appearance="outline"
              className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-[11px] capitalize"
            >
              {task.priority}
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
                  Copier
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="text-muted-foreground text-xs"> description</div>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          {task.assignee && (
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
          )}
          {task.dueDate && (
            <time className="text-[10px] whitespace-nowrap tabular-nums">
              {task.dueDate}
            </time>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle ? (
        <KanbanItemHandle>{cardContent}</KanbanItemHandle>
      ) : (
        cardContent
      )}
    </KanbanItem>
  );
}

interface TaskColumnProps
  extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
  tasks: Task[];
  isOverlay?: boolean;
}

function TaskColumn({ value, tasks, isOverlay, ...props }: TaskColumnProps) {
  return (
    <KanbanColumn
      value={value}
      {...props}
      className="bg-secondary/30 rounded-md border p-2.5 shadow-xs"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold">{COLUMN_TITLES[value]}</span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <Button variant={"ghost"} className="size-7" size="icon">
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
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} asHandle={!isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export function ProgramKanban() {
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({
    backlog: [
      {
        id: "1",
        title: "Add authentication",
        priority: "high",
        assignee: "John Doe",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        dueDate: "Jan 10, 2025",
      },
      {
        id: "2",
        title: "Create API endpoints",
        priority: "medium",
        assignee: "Jane Smith",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
        dueDate: "Jan 15, 2025",
      },
      {
        id: "3",
        title: "Write documentation",
        priority: "low",
        assignee: "Bob Johnson",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
        dueDate: "Jan 20, 2025",
      },
    ],
    inProgress: [
      {
        id: "4",
        title: "Design system updates",
        priority: "high",
        assignee: "Alice Brown",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
        dueDate: "Aug 25, 2025",
      },
      {
        id: "5",
        title: "Implement dark mode",
        priority: "medium",
        assignee: "Charlie Wilson",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
        dueDate: "Aug 25, 2025",
      },
    ],
    done: [
      {
        id: "7",
        title: "Setup project",
        priority: "high",
        assignee: "Eve Davis",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        dueDate: "Sep 25, 2025",
      },
      {
        id: "8",
        title: "Initial commit",
        priority: "low",
        assignee: "Frank White",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
        dueDate: "Sep 20, 2025",
      },
    ],
    done1: [
      {
        id: "9",
        title: "Setup project",
        priority: "high",
        assignee: "Eve Davis",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        dueDate: "Sep 25, 2025",
      },
      {
        id: "10",
        title: "Initial commit",
        priority: "low",
        assignee: "Frank White",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
        dueDate: "Sep 20, 2025",
      },
    ],
    done2: [
      {
        id: "11",
        title: "Setup project",
        priority: "high",
        assignee: "Eve Davis",
        assigneeAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
        dueDate: "Sep 25, 2025",
      },
      {
        id: "12",
        title: "Initial commit",
        priority: "low",
        assignee: "Frank White",
        assigneeAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
        dueDate: "Sep 20, 2025",
      },
    ],
  });

  return (
    <div className="p-5">
      <Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id}
      >
        <KanbanBoard className="grid grid-cols-3 gap-2">
          {Object.entries(columns).map(([columnValue, tasks]) => (
            <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          <div className="bg-muted/60 size-full rounded-md" />
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
