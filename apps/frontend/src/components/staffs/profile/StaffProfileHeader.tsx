"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ImageMinus,
  ImagePlusIcon,
  KeyRound,
  Mails,
  MoreHorizontal,
  Printer,
  UserPlus2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { handleDeleteAvatar } from "~/actions/upload";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChangeAvatarButton } from "~/components/users/ChangeAvatarButton";
import { CreateEditUser } from "~/components/users/CreateEditUser";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CreateEditStaff } from "../CreateEditStaff";

export function StaffProfileHeader({
  staff,
}: {
  staff: NonNullable<RouterOutputs["staff"]["get"]>;
}) {
  const confirm = useConfirm();

  const t = useTranslations();
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

  const { openModal } = useModal();
  const { openSheet } = useSheet();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        {!staff.avatar ? (
          <ChangeAvatarButton id={staff.id} profile="staff">
            <Button variant={"outline"}>
              <ImagePlusIcon />
              {t("change_avatar")}
            </Button>
          </ChangeAvatarButton>
        ) : (
          <Button
            onClick={async () => {
              if (!staff.avatar) return;
              await handleDeleteAvatar(staff.avatar, "staff");
              toast.success(t("deleted_successfully"), {
                id: 0,
              });
              await queryClient.invalidateQueries(trpc.user.get.pathFilter());
              await queryClient.invalidateQueries(trpc.staff.get.pathFilter());
            }}
            variant={"outline"}
            size={"sm"}
            type="button"
          >
            <ImageMinus />
            {t("Remove avatar")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canEditStaff && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    openSheet({
                      view: (
                        <CreateEditStaff
                          staff={staff}
                          formId="create-edit-staff-form"
                        />
                      ),
                      title: t("edit"),
                      description: `${t("staff")} - ${getFullName(staff)}`,
                      formId: "create-edit-staff-form",
                    });
                  }}
                >
                  <EditIcon />
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
                        email={staff.user?.email}
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
              email={staff.user?.email}
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
                  <DeleteIcon />
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
