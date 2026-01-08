"use client";

import { useParams, usePathname } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { EditIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { BreadcrumbsSetter } from "../BreadcrumbsSetter";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { DropdownHelp } from "../shared/DropdownHelp";
import { ClassroomSelector } from "../shared/selects/ClassroomSelector";
import { CreateEditClassroom } from "./CreateEditClassroom";

export function ClassroomHeader() {
  const trpc = useTRPC();
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );

  const t = useTranslations();
  const { createQueryString } = useCreateQueryString();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const canDeleteClassroom = useCheckPermission(
    "classroom",
    PermissionAction.DELETE,
  );
  const canUpdateClassroom = useCheckPermission(
    "classroom",
    PermissionAction.UPDATE,
  );
  const deleteClassroomMutation = useMutation(
    trpc.classroom.delete.mutationOptions({
      onSuccess: async () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const confirm = useConfirm();

  const handleClassroomChange = (value: string) => {
    if (params.id) {
      if (!pathname.includes(params.id)) {
        router.push(`${pathname}/${params.id}/?${createQueryString({})}`);
        return;
      }
      const newPathname =
        pathname.split("/").length > 4
          ? pathname.split("/").slice(0, -1).join("/")
          : pathname;
      const newPath = newPathname.replace(params.id, value);
      router.push(`${newPath}/?${createQueryString({})}`);
    } else {
      router.push(routes.classrooms.details(value));
    }
  };
  const canCreateClassroom = useCheckPermission(
    "classroom",
    PermissionAction.CREATE,
  );
  const { openSheet } = useSheet();

  return (
    <div className="grid w-full flex-row items-center gap-2 px-4 py-1 md:flex">
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/", icon: "home" },
          { label: t("classrooms"), href: "/classrooms" },
        ]}
      />
      <Label className="hidden md:block">{t("classrooms")}</Label>
      <ClassroomSelector
        className="w-full md:w-[400px]"
        defaultValue={params.id}
        onSelect={(value) => {
          if (value) handleClassroomChange(value);
        }}
      />
      <div className="flex items-center gap-2 md:ml-auto">
        {canCreateClassroom && pathname == "/classrooms" && (
          <Button
            disabled={!canCreateClassroom}
            onClick={() => {
              const formId = "create-classroom-form";
              openSheet({
                formId,
                title: t("create"),
                description: t("classroom"),
                view: <CreateEditClassroom formId={formId} />,
              });
            }}
          >
            <Plus aria-hidden="true" />
            {t("add")}
          </Button>
        )}
        {params.id &&
          canUpdateClassroom &&
          pathname == `/classrooms/${params.id}` && (
            <Button
              variant="outline"
              onClick={() => {
                const classroom = classrooms.find((c) => c.id === params.id);
                if (!classroom) return;
                const formId = `edit-classroom-${classroom.id}`;
                openSheet({
                  formId,
                  title: t("edit"),
                  description: classroom.name,
                  view: (
                    <CreateEditClassroom
                      classroom={classroom}
                      formId={formId}
                    />
                  ),
                });
              }}
              size="icon"
            >
              <EditIcon />
            </Button>
          )}
        {pathname == `/classrooms` && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
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
        )}
      </div>
    </div>
  );
}
