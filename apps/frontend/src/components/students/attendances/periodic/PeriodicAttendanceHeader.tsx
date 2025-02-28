"use client";

import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useRouter } from "next/navigation";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { CreateEditPeriodicAttendance } from "./CreateEditPeriodicAttendance";

export function PeriodicAttendanceHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-4 border-y bg-muted/50 px-2 py-1">
      <Label>{t("term")}</Label>
      <TermSelector
        className="h-8 w-[300px]"
        showAllOption={true}
        defaultValue={searchParams.get("term")}
        onChange={(val) => {
          router.push("?" + createQueryString({ term: val }));
        }}
      />
      <div className="ml-auto flex flex-row gap-2">
        <Button
          onClick={() => {
            if (!searchParams.get("term")) {
              toast.error(t("please_select_a_term_first"));
            } else {
              openModal({
                className: "w-[400px]",
                title: t("add_periodic_attendance"),
                view: <CreateEditPeriodicAttendance />,
              });
            }
          }}
          size={"sm"}
        >
          <Plus />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            >
              <Trash2 />
              {t("clear_all")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
