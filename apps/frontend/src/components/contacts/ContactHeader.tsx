"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { SearchCombobox } from "../SearchCombobox";
import { DropdownHelp } from "../shared/DropdownHelp";
import CreateEditContact from "./CreateEditContact";

export function ContactHeader() {
  const router = useRouter();
  const { t } = useLocale();
  //const params = useParams<{ id: string }>();
  const { openSheet } = useSheet();

  const [value, setValue] = useState("");
  const [label, setLabel] = useState(t("search_a_contact"));

  const [search, setSearch] = useState("");
  const contacts = api.contact.search.useQuery({
    query: search,
  });

  return (
    <div className="flex flex-row items-center gap-2 border-b px-4 py-1">
      <Label className="hidden md:block">{t("contacts")}</Label>
      <SearchCombobox
        className="w-full lg:w-1/3"
        items={
          contacts.data?.map((contact) => ({
            value: contact.id,
            label: getFullName(contact),
          })) ?? []
        }
        value={value}
        label={label}
        onSelect={(value, label) => {
          setValue(value);
          setLabel(label ?? "");
          router.push(routes.contacts.details(value));
        }}
        onSearchChange={setSearch}
        searchPlaceholder={t("search") + " ..."}
        noResultsMsg={t("no_results")}
        selectItemMsg={t("select_an_option")}
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
          size={"sm"}
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
        >
          <PlusIcon />
          {t("add")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical />
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
