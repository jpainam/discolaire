"use client";

import { useParams } from "next/navigation";
import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsIsoDate, useQueryState } from "nuqs";

import { DateRangePicker } from "~/components/DateRangePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";

export function AssignmentHeader() {
  const router = useRouter();

  const t = useTranslations();
  const params = useParams<{ id: string }>();
  //const searchParams = useSearchParams();
  //const from = searchParams.get("from");
  //const to = searchParams.get("to");
  ///const { createQueryString } = useCreateQueryString();
  const [from, setFrom] = useQueryState("from", parseAsIsoDate);
  const [to, setTo] = useQueryState("to", parseAsIsoDate);
  const [termId, setTermId] = useQueryState("termId");

  const Icon = sidebarIcons.assignments;
  const canCreateAssignment = useCheckPermission(
    "assignment",
    PermissionAction.CREATE,
  );
  return (
    <div className="flex w-full flex-col">
      <div className="bg-muted grid border-y items-center gap-4 px-4 py-1 lg:flex">
        <div className="flex flex-row items-center gap-2">
          {Icon && <Icon className="hidden h-4 w-4 md:block" />}
          <Label className="hidden md:block">{t("assignments")}</Label>
        </div>
        <TermSelector
          defaultValue={termId}
          onChange={(val) => {
            void setTermId(val ?? null);
          }}
          className="w-64"
        />
        <div className="flex items-center gap-2">
          <Label className="w-[100px]">{t("Date range")}</Label>
          <DateRangePicker
            className="w-96"
            defaultValue={from && to ? { from: from, to: to } : undefined}
            onSelectAction={(range) => {
              if (range?.from) {
                void setFrom(range.from);
              }
              if (range?.to) {
                void setTo(range.to);
              }
            }}
          />
        </div>

        <div className="ml-auto flex flex-row items-center gap-2">
          {canCreateAssignment && (
            <Button
              onClick={() => {
                router.push(`/classrooms/${params.id}/assignments/create`);
              }}
            >
              <PlusIcon />
              {t("add")}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-42">
              <DropdownHelp />
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PDFIcon className="h-4 w-4" />
                {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <XMLIcon className="h-4 w-4" />
                {t("xml_export")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
