"use client";

import type { ReactNode } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  Call02Icon,
  CapIcon,
  FileEmpty02Icon,
  GraduationScrollIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { KeyRound, MoreVertical, UserPlus2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { CreateEditUser } from "~/components/users/CreateEditUser";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { CalendarDays, DeleteIcon, EditIcon, MailIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StaffDetails({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: staff } = useSuspenseQuery(
    trpc.staff.get.queryOptions(staffId),
  );
  const avatar = createAvatar(initials, {
    seed: getFullName(staff),
  });
  const t = useTranslations();
  const locale = useLocale();
  //const { openSheet } = useSheet();

  const confirm = useConfirm();

  const queryClient = useQueryClient();

  const router = useRouter();

  const canDeleteStaff = useCheckPermission("staff.delete");
  const canEditStaff = useCheckPermission("staff.update");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-[50px] w-[50px] xl:h-[100px] xl:w-[100px]">
            <AvatarImage
              src={
                staff.avatar
                  ? `/api/avatars/${staff.avatar}`
                  : avatar.toDataUri()
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <ItemLabel
              icon={<HugeiconsIcon icon={UserIcon} />}
              label={t("lastName")}
              value={staff.lastName}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={UserIcon} />}
              label={t("firstName")}
              value={staff.lastName}
            />
            <ItemLabel
              icon={<MailIcon />}
              label={t("email")}
              value={staff.user?.email}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={Call02Icon} />}
              label={t("phoneNumber")}
              value={staff.phoneNumber1}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={Call02Icon} />}
              label={t("phoneNumber")}
              value={staff.phoneNumber2}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={GraduationScrollIcon} />}
              label={t("jobTitle")}
              value={staff.jobTitle}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={FileEmpty02Icon} />}
              label={t("employmentType")}
              value={staff.employmentType}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={CapIcon} strokeWidth={2} />}
              label={t("degree")}
              value={staff.degree?.name}
            />
            <ItemLabel
              icon={<CalendarDays />}
              label={t("dateOfHire")}
              value={staff.dateOfHire?.toLocaleDateString(locale, {
                month: "short",
                year: "numeric",
                day: "numeric",
              })}
            />
          </div>
        </CardTitle>
        <CardAction className="flex items-center gap-2">
          {canEditStaff && (
            <Button
              onClick={() => {
                router.push(`/staffs/${staffId}/edit`);
                // openSheet({
                //   view: (
                //     <CreateEditStaff
                //       staff={staff}
                //       formId="create-edit-staff-form"
                //     />
                //   ),
                //   title: t("edit"),
                //   description: `${t("staff")} - ${getFullName(staff)}`,
                //   formId: "create-edit-staff-form",
                // });
              }}
              variant={"outline"}
            >
              <EditIcon />
              {t("edit")}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!staff.userId && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("create_a_user"),
                      className: "sm:max-w-xl",
                      view: <CreateEditUser entityId={staffId} type="staff" />,
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
                      className: "sm:max-w-lg",
                      view: (
                        <CreateEditUser
                          userId={staff.userId}
                          type="staff"
                          email={staff.user?.email}
                          entityId={staffId}
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
                        deleteStaffMutation.mutate(staffId);
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
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function ItemLabel({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: ReactNode;
}) {
  return (
    <Item className="p-0">
      <ItemMedia variant="icon">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle> {label}</ItemTitle>
        <ItemDescription> {value ?? "#"}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
