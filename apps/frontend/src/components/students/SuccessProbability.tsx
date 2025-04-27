"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import FlatBadge from "../FlatBadge";
export function SuccessProbability({ studentId }: { studentId: string }) {
  console.log("studentId", studentId);

  return (
    <Tooltip>
      <TooltipTrigger>
        <FlatBadge variant={"pink"}>50%</FlatBadge>
      </TooltipTrigger>
      <TooltipContent>Change de réussite</TooltipContent>
    </Tooltip>
  );
}
