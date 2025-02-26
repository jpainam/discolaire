"use client";

import { ChevronDownIcon, MoreVertical, PlusIcon } from "lucide-react";
import { useState } from "react";

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

import { useRouter } from "next/navigation";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { StudentSearch } from "~/components/students/StudentSearch";
import { endpointReports } from "~/configs/endpoints";
import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { cn } from "~/lib/utils";

export function StudentPageHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const canCreateStudent = useCheckPermissions(
    PermissionAction.CREATE,
    "student:profile",
  );

  return (
    <div className="flex flex-row items-center gap-2 border-b px-2 py-1">
      <Label>{t("students")}</Label>
      <Button
        variant="outline"
        className={cn(
          "flex w-full justify-between bg-background text-sm font-semibold shadow-none 2xl:w-[500px]",
        )}
        onClick={() => setOpen(true)}
      >
        {t("search")}
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
      <StudentSearch
        open={open}
        setOpen={setOpen}
        onChange={(val) => {
          router.push(routes.students.details(val));
        }}
      />
      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateStudent && (
          <Button
            variant={"default"}
            size={"sm"}
            onClick={() => {
              router.push(routes.students.create);
            }}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("create")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `${endpointReports.student_list}?format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `${endpointReports.student_list}?format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
