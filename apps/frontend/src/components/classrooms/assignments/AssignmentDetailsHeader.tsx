"use client";

import { MailIcon, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";

export function AssignmentDetailsHeader({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const { t } = useLocale();
  const utils = api.useUtils();
  const deleteAssignmentMutation = api.assignment.delete.useMutation({
    onSettled: () => {
      void utils.assignment.invalidate();
      void utils.classroom.assignments.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
  });
  const confirm = useConfirm();

  const canDelete = useCheckPermissions(PermissionAction.DELETE, "assignment", {
    id: assignmentId,
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PDFIcon className="mr-2 h-4 w-4" />
          {t("pdf_export")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <XMLIcon className="mr-2 h-4 w-4" />
          {t("xml_export")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailIcon className="mr-2 h-4 w-4" />
          {t("notify")} {t("SMS")}/{t("email")}
        </DropdownMenuItem>
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
              onSelect={async () => {
                const isConfirmed = await confirm({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  icon: <Trash2 className="h-6 w-6 text-destructive" />,
                  alertDialogTitle: {
                    className: "flex items-center gap-1",
                  },
                });
                if (isConfirmed) {
                  toast.loading(t("deleting"), { id: 0 });
                  deleteAssignmentMutation.mutate(assignmentId);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
