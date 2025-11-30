import type { ColumnDef } from "@tanstack/react-table";
import type { _Translator as Translator } from "next-intl";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PiGenderFemaleThin, PiGenderMaleThin } from "react-icons/pi";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import FlatBadge from "~/components/FlatBadge";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { AvatarState } from "../AvatarState";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
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
export function fetchStaffColumns({
  t,
}: {
  t: Translator<Record<string, never>, never>;
}): ColumnDef<StaffProcedureOutput, unknown>[] {
  return [
    {
      id: "select",
      accessorKey: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
        <DataTableColumnHeader column={column} title={t("")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <AvatarState
            avatar={staff.user?.avatar}
            pos={getFullName(row.original).length}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },

    {
      id: "lastName",
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("lastName")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <Link
            className="line-clamp-1 hover:text-blue-600 hover:underline"
            href={routes.staffs.details(staff.id)}
          >
            {staff.lastName}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      id: "firstName",
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("firstName")} />
      ),
      cell: ({ row }) => {
        const staff = row.original;
        return (
          <Link
            className="text-muted-foreground line-clamp-1 hover:text-blue-600 hover:underline"
            href={routes.staffs.details(staff.id)}
          >
            {staff.firstName}
          </Link>
        );
      },
    },

    {
      id: "gender",
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
      filterFn: (row, id, value) => {
        return value instanceof Array && value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "jobTitle",
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
      cell: ({ row }) => {
        const c = row.original;
        return <div className="text-muted-foreground">{c.phoneNumber1}</div>;
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
  ] as ColumnDef<StaffProcedureOutput, unknown>[];
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
          <Button aria-label="Open menu" className="size-8" variant={"ghost"}>
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
                  title: t("edit_staff"),
                  description: `${getFullName(staff)}`,
                });
              }}
            >
              <Pencil /> {t("edit")}
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
                <Trash2 /> {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
