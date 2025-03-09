"use client";

import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { Label } from "@repo/ui/components/label";

import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { DropdownHelp } from "../shared/DropdownHelp";
import { ClassroomSelector } from "../shared/selects/ClassroomSelector";
import { CreateEditClassroom } from "./CreateEditClassroom";

export function ClassroomHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  //const [nextClassroom, setNextClassroom] = useState<Classroom | null>(null);
  //const [prevClassroom, setPrevClassrom] = useState<Classroom | null>(null);
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const canDeleteClassroom = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:details",
    {
      id: params.id,
    }
  );
  const canUpdateClassroom = useCheckPermissions(
    PermissionAction.UPDATE,
    "classroom:details",
    {
      id: params.id,
    }
  );
  const deleteClassroomMutation = api.classroom.delete.useMutation({
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const classroomsQuery = api.classroom.all.useQuery();
  //const classroomQuery = api.classroom.get.useQuery(params.id);
  const confirm = useConfirm();

  useEffect(() => {
    if (!params.id || !classroomsQuery.data) return;
    // const currentClassroomIdx = classroomsQuery.data.findIndex(
    //   (s) => s.id === params.id,
    // );
    // if (!classroomsQuery.data) return;
    // setPrevClassrom(
    //   classroomsQuery.data
    //     ? classroomsQuery.data[currentClassroomIdx - 1]
    //     : null
    // );
    // setNextClassroom(classrooms[currentClassroomIdx + 1] || null);
  }, [params.id, classroomsQuery.data]);

  const handleClassroomChange = (value: string) => {
    if (params.id) {
      if (!pathname.includes(params.id)) {
        router.push(`${pathname}/${params.id}/?${createQueryString({})}`);
        return;
      }
      const newPath = pathname.replace(params.id, value);
      router.push(`${newPath}/?${createQueryString({})}`);
    } else {
      router.push(routes.classrooms.details(value));
    }
  };
  const canCreateClassroom = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:details"
  );
  const { openSheet } = useSheet();
  return (
    <div className="grid w-full flex-row border-b items-center gap-2 px-4 py-1 md:flex">
      <Label className="hidden md:block">{t("classrooms")}</Label>
      <ClassroomSelector
        className="w-full md:w-[400px]"
        defaultValue={params.id}
        onChange={(value) => {
          if (value) handleClassroomChange(value);
        }}
      />
      <div className="flex items-center gap-2 md:ml-auto">
        {canCreateClassroom && (
          <Button
            size={"sm"}
            disabled={!canCreateClassroom}
            onClick={() => {
              openSheet({
                title: t("create_a_classroom"),
                description: t("create_classroom_description"),
                view: <CreateEditClassroom />,
              });
            }}
          >
            <Plus aria-hidden="true" />
            {t("add")}
          </Button>
        )}
        {params.id && canUpdateClassroom && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="size-8"
                variant="outline"
                onClick={() => {
                  const classroom = classroomsQuery.data?.find(
                    (c) => c.id === params.id
                  );
                  if (!classroom) return;
                  openSheet({
                    title: t("edit_a_classroom"),
                    description: t("edit_classroom_description"),
                    view: <CreateEditClassroom classroom={classroom} />,
                  });
                }}
                size="icon"
              >
                <Pencil />
                <span className="sr-only">{t("edit")}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("prev")}</TooltipContent>
          </Tooltip>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(`/api/pdfs/classroom?format=pdf`, "_blank");
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(`/api/pdfs/classroom?format=csv`, "_blank");
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
            {canDeleteClassroom && params.id && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      deleteClassroomMutation.mutate(params.id);
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
    </div>
  );
}
