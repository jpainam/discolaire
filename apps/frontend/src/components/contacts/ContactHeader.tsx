"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { authClient } from "~/auth/client";
import { ContactSelector } from "~/components/shared/selects/ContactSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { breadcrumbAtom } from "~/lib/atoms";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { SearchCombobox } from "../SearchCombobox";
import { DropdownHelp } from "../shared/DropdownHelp";
import CreateEditContact from "./CreateEditContact";

export function ContactHeader() {
  const router = useRouter();

  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const { openSheet } = useSheet();
  const { data: session } = authClient.useSession();

  const [value, setValue] = useState("");
  const [label, setLabel] = useState(t("search_a_contact"));
  const trpc = useTRPC();
  const [search, setSearch] = useState("");
  const contacts = useQuery(
    trpc.contact.all.queryOptions({
      query: search,
    }),
  );

  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    if (!params.id) {
      const breads = [
        { name: t("home"), url: "/" },
        { name: t("contacts"), url: "/contacts" },
      ];
      setBreadcrumbs(breads);
    }
  }, [setBreadcrumbs, t, params.id]);

  const canCreateContact = useCheckPermission(
    "contact",
    PermissionAction.CREATE,
  );

  return (
    <div className="grid flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <Label className="hidden md:block">{t("contacts")}</Label>
      {/* <Button
        onClick={async () => {
          const response = await fetch("/api/notifications/whatsapp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              template: "payment_reminder_1",
            }),
          });
          if (!response.ok) {
            const data = await response.json();
            console.log(data);
            console.log(response.statusText);
          }
        }}
      >
        Text whatsapp
      </Button> */}
      {session?.user.profile != "staff" ? (
        <ContactSelector
          className="w-full lg:w-1/3"
          onChange={(val) => {
            if (val) router.push(routes.contacts.details(val));
          }}
        />
      ) : (
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
      )}

      <div className="ml-auto flex flex-row items-center gap-2">
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
            {t("add")}
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
  );
}
