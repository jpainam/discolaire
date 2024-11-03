"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { api } from "~/trpc/react";

export function SubjectJournalHeader({
  subject,
}: {
  subject: { name: string; id: number };
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const deleteSubjectJournal = api.subjectJournal.clearAll.useMutation({
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onSettled: () => {
      void utils.subjectJournal.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  return (
    <div className="flex flex-row items-center justify-between border-b bg-muted/50 px-2 py-1">
      <Label>{t("subject_journal")}</Label>
      <div className="font-bold">{subject.name}</div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                const isConfirmed = await confirm({
                  title: t("clear_all"),
                  description: t("delete_description"),
                  icon: <Trash2 className="h-6 w-6 text-destructive" />,
                  alertDialogTitle: {
                    className: "flex items-center gap-2",
                  },
                });
                if (isConfirmed) {
                  toast.loading(t("deleting"), { id: 0 });
                  deleteSubjectJournal.mutate({ subjectId: subject.id });
                }
              }}
              className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear_all")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
