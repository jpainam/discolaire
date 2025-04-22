"use client";

import { MoreVertical, PlusIcon, UserPlus, UserSearch } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import CreateEditContact from "~/components/contacts/CreateEditContact";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";
import { LinkContact } from "./LinkContact";

export function StudentContactHeader() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const canAddContact = useCheckPermission("contact", PermissionAction.CREATE);

  const Icon = sidebarIcons.contacts;

  const { openModal } = useModal();
  const { openSheet } = useSheet();

  return (
    <div className="flex flex-row items-center gap-2 bg-secondary px-4 py-1">
      {Icon && <Icon className="hidden md:block h-4 w-4" />}
      <Label className="hidden md:block">{t("contacts")}</Label>

      <div className="md:ml-auto flex flex-row items-center gap-2">
        {canAddContact && (
          <SimpleTooltip content={t("link_contacts")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant={"default"}>
                  <PlusIcon />
                  <span>{t("add")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      className: "p-0",
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
                  <UserSearch />
                  {t("add_from_existing")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    openSheet({
                      title: t("create"),
                      view: <CreateEditContact />,
                    });
                  }}
                >
                  <UserPlus />
                  {t("new")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SimpleTooltip>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="size-8" variant={"outline"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}?format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}?format=pdf`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
