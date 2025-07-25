"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
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
  const { t } = useLocale();
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
      const newPath = pathname.replace(params.id, value);
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

  const setBreadcrumbs = useSetAtom(breadcrumbAtom);

  useEffect(() => {
    const classroom = classrooms.find((c) => c.id === params.id);
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("classrooms"), url: "/classrooms" },
    ];
    if (classroom) {
      breads.push({ name: classroom.name, url: `/classrooms/${classroom.id}` });
    }
    setBreadcrumbs(breads);
  }, [classrooms, params.id, setBreadcrumbs, t]);

  return (
    <div className="grid w-full flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <Label className="hidden md:block">{t("classrooms")}</Label>
      <ClassroomSelector
        className="w-full md:w-[400px]"
        defaultValue={params.id}
        onChange={(value) => {
          if (value) handleClassroomChange(value);
        }}
      />
      <div className="flex items-center gap-2 md:ml-auto">
        {canCreateClassroom && pathname == "/classrooms" && (
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
        {params.id &&
          canUpdateClassroom &&
          pathname == `/classrooms/${params.id}` && (
            <Button
              className="size-8"
              variant="outline"
              onClick={() => {
                const classroom = classrooms.find((c) => c.id === params.id);
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
          )}
        {pathname == `/classrooms` && (
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
