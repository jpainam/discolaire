"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import CreateEditContact from "~/components/contacts/CreateEditContact";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";

export function ContactHeader() {
  const t = useTranslations();

  const { openSheet } = useSheet();

  const canCreateContact = useCheckPermission("contact", "create");
  //const canReadStudent = useCheckPermission("student", "read");
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
