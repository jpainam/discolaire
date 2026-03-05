import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
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
import { DeleteIcon, EditIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { UserLink } from "../UserLink";

type StaffProcedureOutput = NonNullable<RouterOutputs["staff"]["all"]>[number];

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" }).format(
    new Date(date),
  );
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(value);
}

export const staffDefaultColumnVisibility: VisibilityState = {
  firstName: false,
  lastName: false,
  prefix: false,
  isActive: false,
  isTeacher: false,
  employmentType: false,
  dateOfHire: false,
  dateOfRelease: false,
  dateOfBirth: false,
  placeOfBirth: false,
  bloodType: false,
  phoneNumber2: false,
  address: false,
  specialty: false,
  observation: false,
  weeklyWorkingHours: false,
  sendAgendaFrequency: false,
  dateOfLastAdvancement: false,
  dateOfCriminalRecordCheck: false,
  country: false,
  degree: false,
  baseSalary: false,
  travelAllowance: false,
  phoneAllowance: false,
  housingAllowance: false,
  transportAllowance: false,
  performanceBonus: false,
  bankName: false,
  accountNumber: false,
  bankCode: false,
  cnps: false,
  cnss: false,
  tax: false,
};

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
          accessorFn: (staff) => getFullName(staff),
          size: 250,
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
                rootClassName="min-w-0"
                className="truncate min-w-0"
              />
            );
          },
          enableSorting: false,
          enableHiding: false,
        },

        {
          id: "prefix",
          accessorKey: "prefix",
          size: 80,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("prefix")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.prefix}</div>
          ),
        },
        {
          id: "firstName",
          accessorKey: "firstName",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("firstName")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.firstName}</div>
          ),
        },
        {
          id: "lastName",
          accessorKey: "lastName",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("lastName")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.lastName}</div>
          ),
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
          id: "isActive",
          accessorKey: "isActive",
          size: 100,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("status")} />
          ),
          cell: ({ row }) => {
            const active = row.original.isActive;
            return (
              <FlatBadge variant={active ? "green" : "red"}>
                {active ? t("active") : t("inactive")}
              </FlatBadge>
            );
          },
        },

        {
          id: "isTeacher",
          accessorKey: "isTeacher",
          size: 100,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("isTeacher")} />
          ),
          cell: ({ row }) => {
            const isTeacher = row.original.isTeacher;
            return isTeacher ? (
              <FlatBadge variant="blue">{t("yes")}</FlatBadge>
            ) : (
              <FlatBadge variant="red">{t("no")}</FlatBadge>
            );
          },
        },

        {
          id: "jobTitle",
          accessorKey: "jobTitle",
          size: 160,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("jobTitle")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.jobTitle}</div>
          ),
          enableSorting: true,
        },

        {
          id: "specialty",
          accessorKey: "specialty",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("specialty")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.specialty}</div>
          ),
        },

        {
          id: "employmentType",
          accessorKey: "employmentType",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("employmentType")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.employmentType}
            </div>
          ),
        },

        {
          id: "degree",
          accessorFn: (staff) => staff.degree?.name ?? "",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("degree")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.degree?.name}
            </div>
          ),
        },

        {
          id: "weeklyWorkingHours",
          accessorKey: "weeklyWorkingHours",
          size: 80,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("weeklyWorkingHours")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.weeklyWorkingHours}
            </div>
          ),
        },

        {
          id: "phoneNumber1",
          accessorKey: "phoneNumber1",
          size: 140,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("phone")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.phoneNumber1}
            </div>
          ),
          enableSorting: true,
        },

        {
          id: "phoneNumber2",
          accessorKey: "phoneNumber2",
          size: 140,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("phoneNumber2")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.phoneNumber2}
            </div>
          ),
        },

        {
          id: "email",
          accessorFn: (staff) => staff.user?.email ?? staff.email ?? "",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("email")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.user?.email}
            </div>
          ),
          enableSorting: true,
        },

        {
          id: "address",
          accessorKey: "address",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("address")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.address}</div>
          ),
        },

        {
          id: "country",
          accessorFn: (staff) => staff.country?.name ?? "",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("country")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.country?.name}
            </div>
          ),
        },

        {
          id: "dateOfBirth",
          accessorFn: (staff) => staff.dateOfBirth?.toString() ?? "",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("dateOfBirth")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatDate(row.original.dateOfBirth)}
            </div>
          ),
        },

        {
          id: "placeOfBirth",
          accessorKey: "placeOfBirth",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("placeOfBirth")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.placeOfBirth}
            </div>
          ),
        },

        {
          id: "bloodType",
          accessorKey: "bloodType",
          size: 80,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("bloodType")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.bloodType}</div>
          ),
        },

        {
          id: "dateOfHire",
          accessorFn: (staff) => staff.dateOfHire?.toString() ?? "",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("dateOfHire")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatDate(row.original.dateOfHire)}
            </div>
          ),
        },

        {
          id: "dateOfRelease",
          accessorFn: (staff) => staff.dateOfRelease?.toString() ?? "",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("dateOfRelease")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatDate(row.original.dateOfRelease)}
            </div>
          ),
        },

        {
          id: "dateOfLastAdvancement",
          accessorFn: (staff) => staff.dateOfLastAdvancement?.toString() ?? "",
          size: 140,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("dateOfLastAdvancement")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatDate(row.original.dateOfLastAdvancement)}
            </div>
          ),
        },

        {
          id: "dateOfCriminalRecordCheck",
          accessorFn: (staff) =>
            staff.dateOfCriminalRecordCheck?.toString() ?? "",
          size: 160,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("dateOfCriminalRecordCheck")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatDate(row.original.dateOfCriminalRecordCheck)}
            </div>
          ),
        },

        {
          id: "sendAgendaFrequency",
          accessorKey: "sendAgendaFrequency",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("sendAgendaFrequency")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.sendAgendaFrequency}
            </div>
          ),
        },

        {
          id: "observation",
          accessorKey: "observation",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("observation")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.observation}
            </div>
          ),
        },

        // Salary & compensation
        {
          id: "baseSalary",
          accessorKey: "baseSalary",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("baseSalary")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatCurrency(row.original.baseSalary)}
            </div>
          ),
        },
        {
          id: "travelAllowance",
          accessorKey: "travelAllowance",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("travelAllowance")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatCurrency(row.original.travelAllowance)}
            </div>
          ),
        },
        {
          id: "phoneAllowance",
          accessorKey: "phoneAllowance",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("phoneAllowance")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatCurrency(row.original.phoneAllowance)}
            </div>
          ),
        },
        {
          id: "housingAllowance",
          accessorKey: "housingAllowance",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("housingAllowance")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatCurrency(row.original.housingAllowance)}
            </div>
          ),
        },
        {
          id: "transportAllowance",
          accessorKey: "transportAllowance",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("transportAllowance")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatCurrency(row.original.transportAllowance)}
            </div>
          ),
        },
        {
          id: "performanceBonus",
          accessorKey: "performanceBonus",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("performanceBonus")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {formatCurrency(row.original.performanceBonus)}
            </div>
          ),
        },

        // Banking
        {
          id: "bankName",
          accessorKey: "bankName",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("bankName")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.bankName}</div>
          ),
        },
        {
          id: "accountNumber",
          accessorKey: "accountNumber",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t("accountNumber")}
            />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">
              {row.original.accountNumber}
            </div>
          ),
        },
        {
          id: "bankCode",
          accessorKey: "bankCode",
          size: 100,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("bankCode")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.bankCode}</div>
          ),
        },

        // Government IDs
        {
          id: "cnps",
          accessorKey: "cnps",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("cnps")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.cnps}</div>
          ),
        },
        {
          id: "cnss",
          accessorKey: "cnss",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("cnss")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.cnss}</div>
          ),
        },
        {
          id: "tax",
          accessorKey: "tax",
          size: 120,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("tax")} />
          ),
          cell: ({ row }) => (
            <div className="text-muted-foreground">{row.original.tax}</div>
          ),
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
  const canDeleteStaff = useCheckPermission("staff.delete");
  const canUpdateStaff = useCheckPermission("staff.update");

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/staffs/${staff.id}`);
            }}
          >
            <ViewIcon />
            {t("details")}
          </DropdownMenuItem>
          {canUpdateStaff && (
            <DropdownMenuItem
              className=""
              onClick={() => {
                router.push(`/staffs/${staff.id}/edit`);
              }}
            >
              <EditIcon /> {t("edit")}
            </DropdownMenuItem>
          )}

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
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation", {
                      name: getFullName(staff),
                    }),

                    onConfirm: async () => {
                      await deleteStaffMutation.mutateAsync(staff.id);
                    },
                  });
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
