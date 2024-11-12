"use client";

import { useState } from "react";
import { School } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Card, CardContent } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function ClassroomStatistics({ className }: { className?: string }) {
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null,
  );
  const classroomsQuery = api.classroom.all.useQuery();

  const { t } = useLocale();

  if (classroomsQuery.isPending) {
    return (
      <div className={cn(className, "grid grid-cols-1 gap-2 px-2")}>
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  const classrooms = classroomsQuery.data ?? [];
  return (
    <div className={cn(className, "flex flex-col gap-2 px-2")}>
      {classrooms.map((cl) => (
        <Card
          key={cl.id}
          className={`transition-all duration-200 ${
            selectedClassroom === cl.id ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() =>
            setSelectedClassroom(cl.id === selectedClassroom ? null : cl.id)
          }
        >
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <School className="h-6 w-6 text-blue-500 dark:text-blue-300" />
              </div>
              <div>
                <p className="line-clamp-1 overflow-hidden text-sm font-semibold">
                  {" "}
                  {cl.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cl.size} {t("students")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {t("boys")}: {cl.maleCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((cl.maleCount / (cl.size || 1e9)) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {t("girls")}: {cl.femaleCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {((cl.femaleCount / (cl.size || 1e9)) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="h-4 w-24 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(cl.size / (cl.maxSize || 1e9)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
