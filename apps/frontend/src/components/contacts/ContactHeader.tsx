"use client";

import { ChevronDownIcon, MoreVertical, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import { useRouter } from "next/navigation";
import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { DropdownHelp } from "../shared/DropdownHelp";
import { ContactSearch } from "./ContactSearch";
import CreateEditContact from "./CreateEditContact";

export function ContactHeader() {
  const router = useRouter();
  const { t } = useLocale();
  //const params = useParams<{ id: string }>();
  const { openSheet } = useSheet();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid flex-row items-center gap-4 px-4 py-1 md:flex">
      <Label className="hidden md:block">{t("contacts")}</Label>
      <Button
        variant="outline"
        className={cn(
          "flex w-full justify-between bg-background text-sm font-semibold shadow-none 2xl:w-[500px]"
        )}
        onClick={() => setOpen(true)}
      >
        {t("search")}
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
      <ContactSearch
        open={open}
        setOpen={setOpen}
        onChange={(val) => {
          router.push(routes.contacts.details(val));
        }}
      />

      {/* <Label className="hidden md:block"> {t("contacts")}</Label> */}
      {/* <ContactSelector
        defaultValue={params.id}
        className="w-full md:w-[400px]"
       
        placeholder={t("select_an_option")}
        onChange={(val) => {
          val && router.push(routes.contacts.details(val));
        }}
      /> */}

      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          size="icon"
          onClick={() => {
            openSheet({
              className: "w-[600px]",
              title: <p className="px-4 py-2">{t("create")}</p>,
              // description: (
              //   <p className="px-4">{getFullName(contactQuery.data)}</p>
              // ),
              view: <CreateEditContact />,
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
