"use client";

import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreVertical, Trash2 } from "lucide-react";
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

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function SubjectJournalHeader() {
  const trpc = useTRPC();
  const params = useParams<{ subjectId: string }>();
  const { data: subject } = useSuspenseQuery(
    trpc.subject.get.queryOptions(Number(params.subjectId)),
  );

  const { t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const deleteSubjectJournal = useMutation(
    trpc.subjectJournal.clearAll.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.subjectJournal.all.pathFilter(),
        );
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
  return (
    <div className="bg-muted/50 flex flex-row items-center justify-between border-b px-4 py-1">
      <Label>{t("subject_journal")}</Label>
      <Label className="font-bold">{subject.course.name}</Label>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                toast.warning(t("not_implemented"), { id: 0 });
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.warning(t("not_implemented"), { id: 0 });
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            {canDeleteSubject && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("clear_all"),
                      description: t("delete_description"),
                      icon: <Trash2 className="text-destructive" />,
                      alertDialogTitle: {
                        className: "flex items-center gap-2",
                      },
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      deleteSubjectJournal.mutate({ subjectId: subject.id });
                    }
                  }}
                  variant="destructive"
                  className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                >
                  <Trash2 />
                  {t("clear_all")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
