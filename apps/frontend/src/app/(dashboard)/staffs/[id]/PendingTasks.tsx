"use client";

import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";

const initialTasks = [
  {
    id: 1,
    title: "Grade Period 3 quizzes",
    due: "Today",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare calculus lesson plan",
    due: "Tomorrow",
    priority: "medium",
    completed: false,
  },
  {
    id: 3,
    title: "Reply to parent emails",
    due: "Today",
    priority: "high",
    completed: false,
  },
  {
    id: 4,
    title: "Submit attendance reports",
    due: "Friday",
    priority: "low",
    completed: false,
  },
  {
    id: 5,
    title: "Update gradebook entries",
    due: "This week",
    priority: "medium",
    completed: false,
  },
];

export function PendingTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">
            {tasks.filter((t) => !t.completed).length} remaining
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors",
              task.completed && "opacity-50",
            )}
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="mt-0.5"
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  task.completed && "line-through",
                )}
              >
                {task.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-muted-foreground text-xs">
                  {task.due}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-normal",
                    task.priority === "high" &&
                      "border-destructive text-destructive",
                    task.priority === "medium" && "border-chart-3 text-chart-3",
                    task.priority === "low" &&
                      "border-muted-foreground text-muted-foreground",
                  )}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
