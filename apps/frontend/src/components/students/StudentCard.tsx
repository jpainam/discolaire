import { BellRing, FileIcon, Mail, User } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface StudentCardProps {
  name?: string | null | undefined;
}
export function StudentCard({ name }: StudentCardProps) {
  if (!name) return null;
  return (
    <Tooltip>
      <TooltipTrigger>{name}</TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-row gap-2">
          <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
            <User className="h-3 w-3 stroke-1" />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
            <Mail className="h-3 w-3 stroke-1" />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
            <BellRing className="h-3 w-3 stroke-1" />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
            <FileIcon className="h-3 w-3 stroke-1" />
          </Button>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
