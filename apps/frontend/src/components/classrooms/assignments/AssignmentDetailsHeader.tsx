"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MailIcon, MoreVertical, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function AssignmentDetailsHeader({
  assignmentId,
  classroomId,
}: {
  assignmentId: string;
  classroomId: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteAssignmentMutation = useMutation(
    trpc.assignment.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.assignment.pathFilter());
        await queryClient.invalidateQueries(
          trpc.classroom.assignments.pathFilter(),
        );
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(`/classrooms/${classroomId}/assignments`);
      },
    }),
  );
  const confirm = useConfirm();

  const canDelete = useCheckPermission("assignment.delete");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <PDFIcon />
          {t("pdf_export")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <XMLIcon />
          {t("xml_export")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailIcon />
          {t("notify")} {t("SMS")}/{t("email")}
        </DropdownMenuItem>
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={async () => {
                await confirm({
                  title: t("delete"),
                  description: t("delete_confirmation"),

                  onConfirm: async () => {
                    await deleteAssignmentMutation.mutateAsync(assignmentId);
                  },
                });
              }}
            >
              <Trash2 />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
