"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import CreateEditContact from "~/components/contacts/CreateEditContact";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

export function ContactHeader() {
  const { t } = useLocale();

  const { openSheet } = useSheet();

  const canCreateContact = useCheckPermission(
    "contact",
    PermissionAction.CREATE,
  );
  //const canReadStudent = useCheckPermission("student", PermissionAction.READ);
  return (
    <header className="bg-background border-b px-4 py-2">
      <div className="grid grid-cols-1 items-center justify-between gap-2 md:flex">
        <div>
          <h1 className="text-xl font-bold">{t("Contact Management")}</h1>
          <p className="text-muted-foreground hidden text-sm md:flex">
            {t("contact_title_description")}
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-3 md:flex">
          {canCreateContact && (
            <Button
              size={"sm"}
              onClick={() => {
                openSheet({
                  title: t("create"),
                  // description: (
                  //   <p className="px-4">{getFullName(contactQuery.data)}</p>
                  // ),
                  view: <CreateEditContact />,
                });
              }}
            >
              <PlusIcon />
              {t("Add a parent")}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="size-8" size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
