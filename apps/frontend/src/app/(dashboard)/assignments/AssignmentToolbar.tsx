"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { CreateAssignment } from "./CreateAssignment";

export function AssignmentToolbar() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const canCreateAssignment = useCheckPermission(
    "assignment",
    PermissionAction.CREATE,
  );
  return (
    <header className="flex items-center justify-between border-b bg-muted/50 px-4 py-1">
      <Label>{t("assignments")}</Label>
      <div className="flex flex-row items-center gap-2">
        {canCreateAssignment && (
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
            <PlusIcon className="h-4 w-4" />
            {t("create")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
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
