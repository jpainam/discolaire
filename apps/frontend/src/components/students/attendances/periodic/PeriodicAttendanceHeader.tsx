"use client";

import { useSearchParams } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import { TermSelector } from "~/components/shared/selects/TermSelector";
import { CreateEditPeriodicAttendance } from "./CreateEditPeriodicAttendance";

export function PeriodicAttendanceHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-4 border-y bg-muted/40 px-2 py-1">
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
          variant={"outline"}
        >
          <Plus className="mr-2" size={16} />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
