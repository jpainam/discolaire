"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

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

import { DatePicker } from "~/components/DatePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { sidebarIcons } from "../sidebar-icons";

export function AssignmentHeader() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const { createQueryString } = useCreateQueryString();

  const Icon = sidebarIcons.assignments;
  const canCreateAssignment = useCheckPermission(
    "assignment",
    PermissionAction.CREATE,
  );
  return (
    <div className="flex w-full flex-col">
      <div className="grid md:flex flex-row items-center gap-2 md:gap-6 border-b bg-muted px-4 py-1 text-muted-foreground">
        <div className="flex flex-row items-center gap-2">
          {Icon && <Icon className="h-4 w-4 hidden md:block" />}
          <Label className="hidden md:block">{t("assignments")}</Label>
        </div>
        <TermSelector
          onChange={(val) => {
            router.push(`?${createQueryString({ termId: val ?? undefined })}`);
          }}
          className="w-64"
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-row items-center gap-2">
            <Label className="hidden md:block">{t("from")}</Label>
            <DatePicker
              defaultValue={from ? new Date(from) : undefined}
              className="w-56"
              onChange={(val) => {
                router.push(
                  `?${createQueryString({ from: val?.toDateString() })}`,
                );
              }}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <Label className="hidden md:block">{t("to")}</Label>
            <DatePicker
              defaultValue={to ? new Date(to) : undefined}
              className="w-56"
              onChange={(val) => {
                router.push(
                  `?${createQueryString({ to: val?.toDateString() })}`,
                );
              }}
            />
          </div>
        </div>

        <div className="ml-auto flex flex-row items-center gap-2">
          {canCreateAssignment && (
            <Button
              onClick={() => {
                router.push(`/classrooms/${params.id}/assignments/create`);
              }}
              variant={"default"}
              size={"sm"}
            >
              <PlusIcon />
              {t("add")}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="size-8" size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
