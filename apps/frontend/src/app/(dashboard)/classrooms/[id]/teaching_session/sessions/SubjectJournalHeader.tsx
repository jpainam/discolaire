"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function SubjectJournalHeader({
  defaultSubjectId,
  type,
}: {
  defaultSubjectId: number;
  type: "program_coverage" | "teaching_session" | "program";
}) {
  const trpc = useTRPC();
  const [subjectId] = useQueryState(
    "subjectId",
    parseAsInteger.withDefault(defaultSubjectId),
  );

  const subjectQuery = useQuery(trpc.subject.get.queryOptions(subjectId));

  const t = useTranslations();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const deleteSubjectJournal = useMutation(
    trpc.subjectJournal.clearAll.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectJournal.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },

      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const canDeleteSubject = useCheckPermission(
    "subject",
    PermissionAction.DELETE,
  );
  const subject = subjectQuery.data;
  return (
    <div className="bg-muted/50 flex flex-row items-center justify-between border-y px-4 py-1">
      {subjectQuery.isPending ? (
        <Skeleton className="h-8 w-96" />
      ) : (
        <Link
          className="text-sm leading-none font-medium hover:underline"
          href={`/staffs/${subject?.teacherId}`}
        >
          {subject?.teacher?.prefix} {getFullName(subject?.teacher)}
        </Link>
      )}
      {subjectQuery.isPending ? (
        <Skeleton className="h-8 w-56" />
      ) : (
        <Label className="font-bold">{subjectQuery.data?.course.name}</Label>
      )}
      <div className="flex flex-row items-center gap-2">
        <Button size={"sm"} variant={"secondary"}>
          <PDFIcon />
          {t("pdf_export")}
        </Button>
        <Button size={"sm"} variant={"secondary"}>
          <XMLIcon />
          {t("xml_export")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            {canDeleteSubject && (
              <>
                <DropdownMenuSeparator />
                {type == "teaching_session" && (
                  <DropdownMenuItem
                    onSelect={async () => {
                      const isConfirmed = await confirm({
                        title: t("clear_all"),
                        description: t("delete_confirmation"),
                        // icon: <Trash2 className="text-destructive" />,
                        // alertDialogTitle: {
                        //   className: "flex items-center gap-2",
                        // },
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"), { id: 0 });
                        deleteSubjectJournal.mutate({ subjectId: subjectId });
                      }
                    }}
                    variant="destructive"
                    className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  >
                    <Trash2 />
                    {t("clear_all")}
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
