"use client";

import { useParams } from "next/navigation";
import {
  KeyRound,
  Mails,
  MoreHorizontal,
  Pencil,
  Printer,
  Trash2,
  UserPlus2,
} from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";
import { CreateEditUser } from "~/components/users/CreateEditUser";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";

export function StaffProfileHeader() {
  const confirm = useConfirm();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();
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
  const staffQuery = api.staff.get.useQuery(params.id);
  const staff = staffQuery.data;
  const { openModal } = useModal();
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
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              {t("edit")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {staff && !staff.userId && (
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
            {staff?.userId && (
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
            <DropdownInvitation />
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
              onSelect={async () => {
                const isConfirmed = await confirm({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  icon: <Trash2 className="h-6 w-6 text-destructive" />,
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
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
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
