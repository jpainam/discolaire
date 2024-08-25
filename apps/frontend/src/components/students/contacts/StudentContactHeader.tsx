"use client";

import { useParams } from "next/navigation";
import { MoreVertical, PlusIcon, UserPlus, UserSearch } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { SimpleTooltip } from "~/components/simple-tooltip";
import { useModal } from "~/hooks/use-modal";
import { sidebarIcons } from "../sidebar-icons";
import { LinkContact } from "./LinkContact";

export function StudentContactHeader() {
  const params = useParams() as { id: string };
  const { t } = useLocale();

  const Icon = sidebarIcons["contacts"];

  const { openModal } = useModal();

  return (
    <div className="flex flex-row items-center gap-2 bg-secondary p-1 px-2">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("contacts")}</Label>
      <div className="ml-auto flex flex-row gap-2">
        <SimpleTooltip content={t("link_contacts")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <PlusIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    className: "w-[600px] p-0",
                    title: (
                      <div className="px-2 pt-4">{t("add_from_existing")}</div>
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
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                {t("new")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SimpleTooltip>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"outline"}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownHelp />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
