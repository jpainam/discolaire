"use client";

import {
  KeyRound,
  Mails,
  MoreHorizontal,
  Pencil,
  Printer,
  Trash2,
  UserPlus2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEditUser } from "~/components/users/CreateEditUser";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateEditStaff } from "../CreateEditStaff";

export function StaffProfileHeader({
  staff,
}: {
  staff: NonNullable<RouterOutputs["staff"]["get"]>;
}) {
  const confirm = useConfirm();
  const { t } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const canDeleteStaff = useCheckPermission("staff", PermissionAction.DELETE);
  const canEditStaff = useCheckPermission("staff", PermissionAction.UPDATE);
  const deleteStaffMutation = useMutation(
    trpc.staff.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staff.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push("/staffs");
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  // const staffQuery = api.staff.get.useQuery(params.id);
  // const staff = staffQuery.data;
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        <Button variant={"outline"}>{t("change_avatar")}</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEditStaff && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    openSheet({
                      view: <CreateEditStaff staff={staff} />,
                      title: t("edit_staff"),
                      description: `${getFullName(staff)}`,
                    });
                  }}
                >
                  <Pencil />
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {!staff.userId && (
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    title: t("create_a_user"),
                    view: <CreateEditUser entityId={params.id} type="staff" />,
                  });
                }}
              >
                <UserPlus2 />
                {t("create_a_user")}
              </DropdownMenuItem>
            )}
            {staff.userId && (
              <DropdownMenuItem
                onSelect={() => {
                  if (!staff.userId) return;
                  openModal({
                    title: t("change_password"),
                    view: (
                      <CreateEditUser
                        userId={staff.userId}
                        type="staff"
                        entityId={params.id}
                        username={staff.user?.username}
                      />
                    ),
                  });
                }}
              >
                <KeyRound />
                {t("change_password")}
              </DropdownMenuItem>
            )}
            <DropdownInvitation
              entityId={staff.id}
              entityType="staff"
              email={staff.email}
            />
            <DropdownHelp />
            {canDeleteStaff && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                      // icon: <Trash2 className="text-destructive" />,
                      // alertDialogTitle: {
                      //   className: "flex items-center gap-1",
                      // },
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      deleteStaffMutation.mutate(params.id);
                    }
                  }}
                >
                  <Trash2 />
                  {t("delete")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-row items-center gap-0">
        <Button variant={"ghost"} size={"icon"}>
          <Mails className="h-4 w-4" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
