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

import { CreateEditUser } from "~/components/users/CreateEditUser";
import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { CreateEditStaff } from "../CreateEditStaff";

export function StaffProfileHeader({
  staff,
}: {
  staff: NonNullable<RouterOutputs["staff"]["get"]>;
}) {
  const confirm = useConfirm();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();
  const canDeleteStaff = useCheckPermissions(
    PermissionAction.DELETE,
    "staff:profile",
    {
      id: params.id,
    },
  );
  const canEditStaff = useCheckPermissions(
    PermissionAction.UPDATE,
    "staff:profile",
    {
      id: params.id,
    },
  );
  const deleteStaffMutation = api.staff.delete.useMutation({
    onSettled: async () => {
      await utils.staff.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.push(routes.staffs.index);
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
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
            <Button variant={"outline"} size={"icon"}>
              <MoreHorizontal className="h-4 w-4" />
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
                      className: "w-[750px]",
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
                    className: "w-[500px]",
                    title: t("attach_user"),
                    view: <CreateEditUser entityId={params.id} type="staff" />,
                  });
                }}
              >
                <UserPlus2 className="mr-2 h-4 w-4" />
                {t("attach_user")}
              </DropdownMenuItem>
            )}
            {staff.userId && (
              <DropdownMenuItem
                onSelect={() => {
                  if (!staff.userId) return;
                  openModal({
                    className: "w-[500px]",
                    title: t("change_password"),
                    view: (
                      <CreateEditUser
                        userId={staff.userId}
                        type="staff"
                        roleIds={staff.user?.roles.map((r) => r.roleId)}
                        entityId={params.id}
                        username={staff.user?.username}
                      />
                    ),
                  });
                }}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {t("change_password")}
              </DropdownMenuItem>
            )}
            <DropdownInvitation email={staff.email} />
            <DropdownHelp />
            {canDeleteStaff && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                      icon: <Trash2 className="text-destructive" />,
                      alertDialogTitle: {
                        className: "flex items-center gap-1",
                      },
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
