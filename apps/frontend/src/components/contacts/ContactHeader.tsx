"use client";

import { useParams } from "next/navigation";
import { MoreVertical, PlusIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { DropdownHelp } from "../shared/DropdownHelp";
import { ContactSelector } from "../shared/selects/ContactSelector";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CreateEditContact from "./CreateEditContact";

export function ContactHeader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const contactQuery = api.contact.get.useQuery(params.id);

  return (
    <div className="grid flex-row items-center gap-4 px-4 py-1 md:flex">
      <Label className="hidden md:block"> {t("contacts")}</Label>
      <ContactSelector
        defaultValue={params.id}
        className="w-full md:w-[400px]"
        searchPlaceholder={t("search_for_an_option")}
        placeholder={t("select_an_option")}
        onChange={(val) => {
          val && router.push(routes.contacts.details(val));
        }}
      />

      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          size="icon"
          onClick={() => {
            if (!contactQuery.data) return;
            openSheet({
              className: "w-[600px]",
              title: <p className="px-4 py-2">{t("edit")}</p>,
              description: (
                <p className="px-4">{getFullName(contactQuery.data)}</p>
              ),
              view: <CreateEditContact contact={contactQuery.data} />,
            });
          }}
          variant="outline"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        {/* <Button size="icon" variant="outline">
          <Reply className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline">
          <Forward className="h-4 w-4" />
        </Button> */}
        {/* <Separator orientation="vertical" className="h-6" /> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
