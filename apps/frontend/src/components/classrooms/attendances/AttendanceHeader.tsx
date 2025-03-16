"use client";

import {
  BaselineIcon,
  ChevronDown,
  ChevronsUpDown,
  DiameterIcon,
  MoreVertical,
  NewspaperIcon,
  ShapesIcon,
  ShieldAlertIcon,
  Trash2,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

export function AttendanceHeader() {
  const { t } = useLocale();
  //const [query, setQuery] = useState<Record<string, any>>({});
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const confirm = useConfirm();
  const deletePeriodictAttendance = api.attendance.deletePeriodic.useMutation({
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
  });

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const termId = searchParams.get("term");

  return (
    <div className="grid flex-row items-center gap-4 border-b bg-muted px-4 py-1 md:flex">
      <Label className="hidden md:block">{t("periods")}</Label>
      <TermSelector
        className="md:w-[300px]"
        defaultValue={termId}
        onChange={(val) => {
          router.push(
            routes.classrooms.attendances.index(params.id) +
              "?" +
              createQueryString({ term: val })
          );
        }}
      />
      <Label>{t("type")}</Label>
      <Select
        defaultValue={searchParams.get("type") ?? undefined}
        onValueChange={(val) => {
          router.push(
            routes.classrooms.attendances.index(params.id) +
              "?" +
              createQueryString({ type: val == "all" ? undefined : val })
          );
        }}
      >
        <SelectTrigger className="md:w-[200px]">
          <SelectValue placeholder={t("all_types")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all_types")}</SelectItem>
          <SelectItem value="absence">{t("absence")}</SelectItem>
          <SelectItem value="lateness">{t("late")}</SelectItem>
          <SelectItem value="chatter">{t("chatter")}</SelectItem>
          <SelectItem value="consigne">{t("consigne")}</SelectItem>
          <SelectItem value="exclusion">{t("exclusion")}</SelectItem>
        </SelectContent>
      </Select>
      <Label>{t("date")}</Label>
      <Input
        type="date"
        className="md:w-[200px]"
        onChange={(e) => {
          router.push(
            routes.classrooms.attendances.index(params.id) +
              "?" +
              createQueryString({ date: e.target.value })
          );
        }}
      />

      <div className="ml-auto flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"outline"}>
              {t("bulk_actions")} <ChevronsUpDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{t("pdf_export")}</DropdownMenuItem>
            <DropdownMenuItem>{t("xml_export")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!termId}
              onSelect={async () => {
                const isConfirmed = await confirm({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  icon: <Trash2 className="text-destructive" />,
                  alertDialogTitle: {
                    className: "flex items-center gap-2",
                  },
                });
                if (isConfirmed) {
                  toast.loading(t("deleting"), { id: 0 });
                  if (!termId) {
                    return;
                  }
                  deletePeriodictAttendance.mutate({
                    classroomId: params.id,
                    termId: Number(termId),
                  });
                }
              }}
              variant="destructive"
              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            >
              {t("delete_periodic_attendance")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!termId} size={"sm"}>
              {t("add")}
              <ChevronDown
                className="-me-1 ms-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.absences(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") })
                );
              }}
            >
              <BaselineIcon className="mr-2 h-4 w-4" />
              {t("absence")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.lateness(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") })
                );
              }}
            >
              <DiameterIcon className="mr-2 h-4 w-4" />
              {t("lateness")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.chatters(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") })
                );
              }}
            >
              <NewspaperIcon className="mr-2 h-4 w-4" />
              {t("chatter")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.consignes(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") })
                );
              }}
            >
              <ShapesIcon className="mr-2 h-4 w-4" />
              {t("consigne")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(
                  routes.classrooms.attendances.exclusions(params.id) +
                    "?" +
                    createQueryString({ term: searchParams.get("term") })
                );
              }}
            >
              <ShieldAlertIcon className="mr-2 h-4 w-4" />
              {t("exclusion")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} className="size-8" variant={"outline"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <PDFIcon className="w-4 h-4" />
                {t("pdf_export")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/attendances?format=pdf&type=weekly`,
                        "_blank"
                      );
                    }}
                  >
                    {t("weekly_attendance_report")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/attendances?format=pdf&type=periodic`,
                        "_blank"
                      );
                    }}
                  >
                    {t("periodic_attendance_report")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2">
                <XMLIcon className="w-4 h-4" />
                {t("xml_export")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/attendances?format=csv&type=weekly`,
                        "_blank"
                      );
                    }}
                  >
                    {t("weekly_attendance_report")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/attendances?format=csv&type=periodic`,
                        "_blank"
                      );
                    }}
                  >
                    {t("periodic_attendance_report")}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
