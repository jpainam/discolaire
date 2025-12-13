"use client";

import { useParams, usePathname } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, PlusIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

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
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function ClassroomAttendanceHeader() {
  const [termId, setTermId] = useQueryState("termId");
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const canCreateAttendance = useCheckPermission(
    "attendance",
    PermissionAction.CREATE,
  );
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const clearAllAttendance = useMutation(
    trpc.attendance.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const canDeleteAttendance = useCheckPermission(
    "attendance",
    PermissionAction.DELETE,
  );
  const confirm = useConfirm();

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
          <DropdownMenuContent align="end">
            <DropdownHelp />

            {canDeleteAttendance && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      clearAllAttendance.mutate({
                        classroomId: params.id,
                        termId: termId ?? undefined,
                      });
                    }
                  }}
                >
                  <Trash />
                  {t("clear_all")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
