"use client";

import { PlusIcon, UserPlus, UserSearch } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

// TODO uncomment this
//import CreateEditContact from "~/components/contacts/CreateEditContact";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";
import { LinkContact } from "./LinkContact";

export function StudentContactHeader() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const canAddContact = useCheckPermissions(
    PermissionAction.CREATE,
    "student:contact",
    {
      id: params.id,
    },
  );

  const Icon = sidebarIcons.contacts;

  const { openModal } = useModal();
  const { openSheet } = useSheet();

  return (
    <div className="flex flex-row items-center gap-2 bg-secondary p-4">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("contacts")}</Label>

      <div className="ml-auto flex flex-row items-center gap-2">
        {canAddContact && (
          <SimpleTooltip content={t("link_contacts")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant={"default"}>
                  <PlusIcon className="h-4 w-4" />
                  <span>{t("add")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      className: "w-[600px] p-0",
                      title: (
                        <p className="px-2 pt-4">{t("add_from_existing")}</p>
                      ),
                      // description: (
                      //   <div className="px-2">{t("add_from_existing")}</div>
                      // ),
                      view: <LinkContact studentId={params.id} />,
                    });
                  }}
                >
                  <UserSearch className="mr-2 h-4 w-4" />
                  {t("add_from_existing")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    openSheet({
                      className: "w-[600px]",
                      title: <p className="px-4 py-2">{t("create")}</p>,
                      // description: (
                      //   <p className="px-4">{getFullName(contactQuery.data)}</p>
                      // ),
                      view: <div>create editcontact</div>,
                      // view: <CreateEditContact />,
                    });
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t("new")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SimpleTooltip>
        )}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"secondary"}>
              <span>Plus</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
}
