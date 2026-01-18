"use client";

import { useParams } from "next/navigation";
import { MoreVertical, PlusIcon, UserPlus, UserSearch } from "lucide-react";
import { useTranslations } from "next-intl";

import CreateEditContact from "~/components/contacts/CreateEditContact";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { sidebarIcons } from "../sidebar-icons";
import { LinkContact } from "./LinkContact";

export function StudentContactHeader() {
  const params = useParams<{ id: string }>();

  const t = useTranslations();
  const canAddContact = useCheckPermission("contact", "create");

  const Icon = sidebarIcons.contacts;

  const { openModal } = useModal();
  const { openSheet } = useSheet();

  return (
    <div className="bg-muted/50 flex flex-row items-center gap-2 px-4 py-1">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("contacts")}</Label>

      <div className="ml-auto flex flex-row items-center gap-2">
        {canAddContact && (
          <SimpleTooltip content={t("link_contacts")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusIcon />
                  <span>{t("add")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      className: "sm:max-w-lg p-0",
                      title: (
                        <p className="px-4 pt-4">{t("add_from_existing")}</p>
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
                      view: <CreateEditContact studentId={params.id} />,
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
            <Button size={"icon"} variant={"outline"}>
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
