"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import { CreateAssignment } from "./CreateAssignment";

export function AssignmentToolbar() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <header className="flex items-center justify-between border-b bg-muted/50 px-4 py-1">
      <Label>{t("assignments")}</Label>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: t("create_assignment"),
              className: "sm:max-w-lg",
              description: t("create_assignment_description"),
              view: <CreateAssignment />,
            });
          }}
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("create")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
