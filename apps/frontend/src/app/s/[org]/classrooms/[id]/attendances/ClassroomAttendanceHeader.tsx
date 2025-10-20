"use client";

import { useParams, usePathname } from "next/navigation";
import { MoreVertical, PlusIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";

export function ClassroomAttendanceHeader() {
  const [termId, setTermId] = useQueryState("termId", {
    shallow: false,
  });
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const canCreateAttendance = useCheckPermission(
    "attendance",
    PermissionAction.CREATE,
  );

  return (
    <div className="bg-muted grid flex-row items-center gap-4 border-b px-4 py-1 md:flex">
      <div className="flex flex-row items-center gap-2">
        <Label className="hidden md:block">{t("periods")}</Label>
        <TermSelector
          className="md:w-[300px]"
          defaultValue={termId}
          onChange={(val) => {
            void setTermId(val);
          }}
        />
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        {!pathname.includes("create") && canCreateAttendance && (
          <Button
            disabled={!termId}
            onClick={() => {
              router.push(
                `/classrooms/${params.id}/attendances/create?termId=${termId}`,
              );
            }}
            size={"sm"}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon-sm"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash />
              {t("clear_all")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
