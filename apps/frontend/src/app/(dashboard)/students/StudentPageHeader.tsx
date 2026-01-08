"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { authClient } from "~/auth/client";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { SearchCombobox } from "~/components/SearchCombobox";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StudentPageHeader() {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const canCreateStudent = useCheckPermission(
    "student",
    PermissionAction.CREATE,
  );

  const [value, setValue] = useState("");
  const [label, setLabel] = useState(t("search"));
  const [search, setSearch] = useState("");
  const trpc = useTRPC();
  const students = useQuery(
    trpc.student.all.queryOptions({
      query: search,
    }),
  );

  if (session?.user.profile !== "staff") {
    return null;
  }
  return (
    <div className="grid flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("students"), href: "/students" },
        ]}
      />
      <Label className="hidden md:block">{t("students")}</Label>

      <SearchCombobox
        className="w-full lg:w-1/3"
        items={
          students.data?.map((stud) => ({
            value: stud.id,
            label: getFullName(stud),
          })) ?? []
        }
        isLoading={students.isPending}
        value={value}
        label={label}
        onSelect={(value, label) => {
          setValue(value);
          setLabel(label ?? "");
          router.push(routes.students.details(value));
        }}
        onSearchChange={setSearch}
        searchPlaceholder={t("search") + " ..."}
        noResultsMsg={t("no_results")}
        selectItemMsg={t("select_an_option")}
      />
      {/* )} */}

      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateStudent && (
          <Button
            onClick={() => {
              router.push(routes.students.create);
            }}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon-sm"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(`/api/pdfs/student?format=pdf`, "_blank");
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(`/api/pdfs/student?format=csv`, "_blank");
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
