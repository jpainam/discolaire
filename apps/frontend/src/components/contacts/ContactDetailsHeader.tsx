"use client";

import {
  ChevronDown,
  ImageUpIcon,
  MoreVertical,
  Pencil,
  PlusIcon,
  Printer,
  Trash2,
} from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Skeleton } from "@repo/ui/skeleton";

import { AvatarState } from "~/components/AvatarState";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import CreateEditContact from "./CreateEditContact";
import { LinkStudent } from "./LinkStudent";

export function ContactDetailsHeader({ contactId }: { contactId: string }) {
  const contactQuery = api.contact.get.useQuery(contactId);
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const { openModal } = useModal();

  if (contactQuery.isPending) {
    return (
      <div className="flex flex-col gap-2">
        {rangeMap(4, (index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  const contact = contactQuery.data;
  return (
    <div className="flex flex-row items-start gap-2">
      <AvatarState pos={0} className="h-auto w-[100px]" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              openSheet({
                title: (
                  <p className="px-4 py-2">
                    {t("edit")} -{" "}
                    {contactQuery.data?.lastName ??
                      contactQuery.data?.firstName}
                  </p>
                ),
                className: "w-[600px]",
                // @ts-expect-error TODO fix this
                view: <CreateEditContact contact={contact} />,
              });
            }}
            variant={"outline"}
            size={"icon"}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />
              <DropdownMenuSeparator />
              <DropdownInvitation email={contactQuery.data?.email} />
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid flex-row gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"sm"}>
                <Printer className="mr-2 h-4 w-4" />
                {t("print")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
              <DropdownMenuItem>{t("students")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant={"outline"} size={"sm"}>
            <ImageUpIcon className="mr-2 h-4 w-4" />
            {t("change_avatar")}
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              openModal({
                className: "p-0 w-[600px]",
                title: <p className="px-4 py-2">{t("link_students")}</p>,
                view: <LinkStudent contactId={contactId} />,
              });
            }}
            size={"sm"}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("link_students")}
          </Button>
        </div>
      </div>
    </div>
  );
}
