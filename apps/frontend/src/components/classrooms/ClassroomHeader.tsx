"use client";

import { Forward, MoreVertical, Pencil, Reply, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useCreateQueryString } from "~/hooks/create-query-string";
import { useSheet } from "~/hooks/use-sheet";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Separator } from "@repo/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

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
  const classroomQuery = api.classroom.get.useQuery(params.id);
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
  const { openSheet } = useSheet();
  return (
    <div className="grid w-full flex-row items-center gap-2 border-b px-2 py-1 md:flex">
      <ClassroomSelector
        className="w-full md:w-[300px]"
        defaultValue={params.id}
        onChange={(value) => {
          if (value) handleClassroomChange(value);
        }}
      />
      <div className="flex items-center gap-2 md:ml-auto">
        {classroomQuery.data && canUpdateClassroom && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  //disabled={!prevClassroom}
                  variant="outline"
                  onClick={() => {
                    openSheet({
                      className: "w-[700px]",
                      title: (
                        <div className="p-2">
                          {t("edit")} {classroomQuery.data.name}
                        </div>
                      ),
                      view: (
                        <CreateEditClassroom classroom={classroomQuery.data} />
                      ),
                    });
                  }}
                  size="icon"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">{t("create")}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("prev")}</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6" />
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              //disabled={!prevClassroom}
              variant="outline"
              onClick={() => {
                // prevClassroom &&
                //   router.push(
                //     pathname.replace(params.id as string, prevClassroom.id)
                //   );
              }}
              size="icon"
            >
              <Reply className="h-4 w-4" />
              <span className="sr-only">{t("prev")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("prev")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              //disabled={!nextClassroom}
              onClick={() => {
                // nextClassroom &&
                //   router.push(
                //     pathname.replace(params.id as string, nextClassroom.id)
                //   );
              }}
              variant="outline"
              size="icon"
            >
              <Forward className="h-4 w-4" />
              <span className="sr-only">{t("next")}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("next")}</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              <span>{t("pdf_export")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              <span>{t("xml_export")}</span>
            </DropdownMenuItem>

            {canDeleteClassroom && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
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
                  <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
