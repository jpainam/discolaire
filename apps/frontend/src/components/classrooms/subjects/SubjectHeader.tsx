"use client";

import { useLocale } from "@/hooks/use-locale";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import { MoreVertical } from "lucide-react";

import { sidebarIcons } from "../sidebar-icons";
import { SubjectStats } from "./SubjectStats";

export function SubjectHeader() {
  const Icon = sidebarIcons["subjects"];
  const { t } = useLocale();

  return (
    <div className="flex w-full flex-row items-center gap-2 border-b bg-muted px-1 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("subjects")}</Label>
      <SubjectStats />
      <div className="ml-auto flex flex-row gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="h-8 w-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
