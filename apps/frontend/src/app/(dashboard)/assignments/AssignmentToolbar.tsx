"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { CreateAssignment } from "./CreateAssignment";

export function AssignmentToolbar() {
  const t = useTranslations();
  const { openModal } = useModal();
  const canCreateAssignment = useCheckPermission("assignment", "create");
  return (
    <header className="bg-muted/50 flex items-center justify-between border-b px-4 py-1">
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
