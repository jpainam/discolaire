"use client";

import { Button } from "@repo/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function PeriodicAttendanceTableActions({
  studentId,
}: {
  studentId: string;
}) {
  return (
    <div className="flex flex-row justify-end gap-2">
      <Button variant={"ghost"} size={"icon"}>
        <Pencil size={16} />
      </Button>
      <Button variant={"ghost"} size={"icon"}>
        <Trash2 className="text-destructive" size={16} />
      </Button>
    </div>
  );
}
