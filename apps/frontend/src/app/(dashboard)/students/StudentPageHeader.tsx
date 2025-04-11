"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { SearchCombobox } from "~/components/SearchCombobox";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { breadcrumbAtom } from "~/lib/atoms";
import { useSession } from "~/providers/AuthProvider";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StudentPageHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const session = useSession();

  const canCreateStudent = useCheckPermission(
    "student",
    PermissionAction.CREATE
  );

  const [value, setValue] = useState("");
  const [label, setLabel] = useState(t("search"));
  const [search, setSearch] = useState("");
  const trpc = useTRPC();
  const students = useQuery(
    trpc.student.search.queryOptions({
      query: search,
    })
  );

  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("students"), url: "/students" },
    ];
    setBreadcrumbs(breads);
  }, [setBreadcrumbs, t]);

  if (session.user?.profile !== "staff") {
    return null;
  }
  return (
    <div className="grid md:flex flex-row items-center gap-2 border-b px-4 py-1">
      <Label className="hidden md:block">{t("students")}</Label>
      {/* {session.user?.profile === "contact" ? (
        <StudentSelector
          onChange={(val) => {
            if (val) {
              router.push(routes.students.details(val));
            } else {
              router.push("/students");
            }
          }}
          className="w-full lg:w-1/3"
        />
      ) : ( */}
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
            size={"sm"}
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
            <Button variant={"outline"} className="size-8" size={"icon"}>
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
