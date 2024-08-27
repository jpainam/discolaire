"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { inferProcedureOutput } from "@trpc/server";
import { Forward, Reply } from "lucide-react";

import { useAlert } from "@repo/hooks/use-alert";
import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { routes } from "~/configs/routes";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { StaffSelector } from "../shared/selects/StaffSelector";

type StaffProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["staff"]["all"]>
>[number];

export function StaffDetailHeader() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const { openAlert, closeAlert } = useAlert();
  const [nextStaff, setNextStaff] = useState<StaffProcedureOutput | null>(null);
  const [prevStaff, setPrevStaff] = useState<StaffProcedureOutput | null>(null);
  const staffQuery = api.staff.get.useQuery({ id: params.id });
  const staffsQuery = api.staff.all.useQuery();

  const router = useRouter();
  const { t: t2 } = useLocale("print");
  useEffect(() => {
    if (!params.id || !staffsQuery.data) return;
    const staffs = staffsQuery.data;
    const currentStaffIdx = staffsQuery.data.findIndex(
      (s) => s.id === params.id,
    );
    setPrevStaff(staffs[currentStaffIdx - 1] || null);
    setNextStaff(staffs[currentStaffIdx + 1] || null);
  }, [params.id, staffsQuery.data]);

  if (staffQuery.isError) {
    throw staffQuery.error;
  }
  // if (isPending) {
  //   return <Skeleton className="h-12 w-full" />;
  // }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-4 px-4 py-1">
        <Label>{t("staffs")}</Label>
        <StaffSelector
          className="w-[350px]"
          onChange={(staffId) => {
            router.push(routes.staffs.details(staffId));
          }}
          defaultValue={params.id}
        />
        <div className="ml-auto flex flex-row items-center gap-2">
          {/* <Button
            onClick={() => {
              if (!staff) return;
              openSheet({
                className: "w-[750px]",
                title: (
                  <div className="px-2">
                    {t("edit")} {getFullName(staff)}
                  </div>
                ),
                view: <CreateEditStaff staff={staff} />,
              });
            }}
            size="icon"
            variant="outline"
            className="h-8 w-8 gap-1"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => {
              if (!staff) return;
              openAlert({
                title: t("delete"),
                description: t("delete_confirmation"),
                onConfirm: () => {
                  toast.promise(deleteStaff(staff.id), {
                    loading: t("deleting"),
                    success: () => {
                      return t("deleted_successfully");
                    },
                    error: (err) => {
                      console.error(err);
                      return getErrorMessage(err);
                    },
                  });
                },
                onCancel: () => {
                  closeAlert();
                },
              });
            }}
            variant={"outline"}
            size={"icon"}
            className="h-8 w-8 hover:text-destructive/90 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" /> */}

          <Button
            disabled={!prevStaff}
            onClick={() => {
              prevStaff && router.push(routes.staffs.details(prevStaff.id));
            }}
            size="icon"
            variant="outline"
          >
            <Reply className="h-4 w-4" />
          </Button>
          <Button
            disabled={!nextStaff}
            onClick={() => {
              nextStaff && router.push(routes.staffs.details(nextStaff.id));
            }}
            size="icon"
            variant="outline"
          >
            <Forward className="h-4 w-4" />
          </Button>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  toast.promise(Promise.resolve(), {
                    loading: t2("exporting_staff_information"),
                    success: () => {
                      router.push(routes.reports.index);
                      return t2("staff_information_exported_successfully");
                    },
                    error: (e) => {
                      console.error(e);
                      return getErrorMessage(e);
                    },
                  });
                }}
              >
                <PDFIcon className="h-4 w-4 mr-2" />
                {t2("staff_information")}
              </DropdownMenuItem>
              <DropdownMenuItem
                // TODO implement exporting staff information
                onClick={() => {
                  toast.promise(Promise.resolve(), {
                    loading: t2("exporting_staff_information"),
                    success: () => {
                      router.push(routes.reports.index);
                      return t2("staff_information_exported_successfully");
                    },
                    error: (e) => {
                      console.error(e);
                      return getErrorMessage(e);
                    },
                  });
                }}
              >
                <XMLIcon className="size-4 mr-2" /> {t2("staff_information")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  );
}
