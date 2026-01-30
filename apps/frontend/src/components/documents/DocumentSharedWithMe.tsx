"use client";

import { Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const sharedUsers = [
  { name: "Sarah Chen", avatar: "sarah", initials: "SC" },
  { name: "Alex Kim", avatar: "alex", initials: "AK" },
  { name: "Marie Dupont", avatar: "marie", initials: "MD" },
  { name: "John Doe", avatar: "john", initials: "JD" },
  { name: "Emma Wilson", avatar: "emma", initials: "EW" },
];

export function DocumentSharedWithMe() {
  return (
    <TooltipProvider>
      <div className="bg-card rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Team Members</h3>
          <span className="text-muted-foreground text-xs">
            {sharedUsers.length} people
          </span>
        </div>
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {sharedUsers.slice(0, 4).map((user) => (
              <Tooltip key={user.name}>
                <TooltipTrigger asChild>
                  <Avatar className="border-card size-8 cursor-pointer border-2 transition-transform hover:z-10 hover:scale-110">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatar}`}
                    />
                    <AvatarFallback className="text-[10px]">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{user.name}</TooltipContent>
              </Tooltip>
            ))}
            {sharedUsers.length > 4 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="border-card bg-muted hover:bg-muted/80 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 transition-colors">
                    <span className="text-muted-foreground text-xs font-medium">
                      +{sharedUsers.length - 4}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {sharedUsers
                    .slice(4)
                    .map((u) => u.name)
                    .join(", ")}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Button variant="outline" size="icon" className="ml-2 size-8">
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
