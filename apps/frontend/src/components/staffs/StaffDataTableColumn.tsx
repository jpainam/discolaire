import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReceiptText } from "lucide-react";
import { useTranslations } from "next-intl";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { DataTableColumnHeader } from "~/components/datatable/data-table-column-header";
import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { UserLink } from "../UserLink";
import { CreateEditStaff } from "./CreateEditStaff";

//  const defaultVisibles = [
//       "select",
//       "id",
//       "avatar",
//       "lastName",
//       "firstName",
//       "gender",
//       "jobTitle",
//       "phoneNumber1",
//       "email",
//       //"degreeId",
//       //"employmentType",
//       "actions",
//     ];
type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];
export function useStaffColumns(): ColumnDef<StaffProcedureOutput, unknown>[] {
  const t = useTranslations();
  return useMemo(
    () =>
      [
        {
          id: "select",
          accessorKey: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          size: 28,
          enableSorting: false,
          enableHiding: false,
        },
        {
          id: "avatar",
          accessorKey: "avatar",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={""} />
          ),
          cell: ({ row }) => {
            const staff = row.original;
            return (
              <UserLink
                id={staff.id}
                profile="staff"
                name={getFullName(staff)}
                avatar={staff.avatar}
              />
            );
          },
          enableSorting: false,
          enableHiding: false,
        },

        {
          id: "gender",
          size: 120,
          accessorKey: "gender",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("gender")} />
          ),
          cell: ({ row }) => {
            const staff = row.original;
            const gender = staff.gender;
            return (
              <FlatBadge
                variant={staff.gender == "female" ? "pink" : "blue"}
                className="flex w-[80px] flex-row items-center gap-1"
              >
                {staff.gender == "male" ? (
                  <PiGenderMaleThin className="h-4 w-4" />
                ) : (
                  <PiGenderFemaleThin className="h-4 w-4" />
                )}

                {t(gender)}
              </FlatBadge>
            );
          },
          enableSorting: true,
        },

        {
          accessorKey: "jobTitle",
          size: 80,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("jobTitle")} />
          ),
          cell: ({ row }) => {
            const c = row.original;
            return <div className="text-muted-foreground">{c.jobTitle}</div>;
          },
          enableSorting: true,
        },
        {
          accessorKey: "phoneNumber1",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("phone")} />
          ),
          size: 50,
          cell: ({ row }) => {
            const c = row.original;
            return (
              <div className="text-muted-foreground">{c.phoneNumber1}</div>
            );
          },
          enableSorting: true,
        },
        {
          accessorKey: "email",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("email")} />
          ),
          cell: ({ row }) => {
            const c = row.original;
            return <div className="text-muted-foreground">{c.user?.email}</div>;
          },
          enableSorting: true,
        },

        {
          id: "actions",
          cell: ({ row }) => <ActionsCell staff={row.original} />,
          size: 60,
          enableSorting: false,
          enableHiding: false,
        },
      ] as ColumnDef<StaffProcedureOutput, unknown>[],
    [t],
  );
}

function ActionsCell({ staff }: { staff: StaffProcedureOutput }) {
  const t = useTranslations();
  const { openSheet } = useSheet();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const deleteStaffMutation = useMutation(
    trpc.staff.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.staff.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const router = useRouter();
  const canDeleteStaff = useCheckPermission("staff", PermissionAction.DELETE);
  const canUpdateStaff = useCheckPermission("staff", PermissionAction.UPDATE);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/staffs/${staff.id}`);
            }}
          >
            <ReceiptText />
            <span className="text-sm">{t("details")}</span>
          </DropdownMenuItem>
          {canUpdateStaff && (
            <DropdownMenuItem
              className=""
              onClick={() => {
                openSheet({
                  view: <CreateEditStaff staff={staff} />,
                  title: t("edit"),
                  description: `${t("staff")} - ${getFullName(staff)}`,
                });
              }}
            >
              <EditIcon /> {t("edit")}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownInvitation
            entityId={staff.id}
            entityType="staff"
            email={staff.user?.email}
          />

          {canDeleteStaff && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={deleteStaffMutation.isPending}
                variant="destructive"
                onClick={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation", {
                      name: getFullName(staff),
                    }),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteStaffMutation.mutate(staff.id);
                  }
                }}
              >
                <DeleteIcon /> {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
