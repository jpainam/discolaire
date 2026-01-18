"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutGridIcon, ListIcon, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function StudentGradeHeader() {
  const t = useTranslations();
  const trpc = useTRPC();
  const params = useParams<{ gradeId: string; id: string }>();

  const [termId, setTermId] = useQueryState("termId", parseAsString);
  const [view, setView] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });
  const router = useRouter();

  const queryClient = useQueryClient();
  const canDeleteGradesheet = useCheckPermission("gradesheet", "delete");
  const confirm = useConfirm();
  const deleteGradeMutation = useMutation(
    trpc.grade.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        await queryClient.invalidateQueries(trpc.student.grades.pathFilter());
        router.push(`/students/${params.id}/grades`);
      },
    }),
  );

  return (
    <div className="bg-muted/50 flex flex-row items-center gap-6 border-b px-4 py-1">
      <div className="flex items-center gap-1">
        <ListIcon className="h-4 w-4" />
        <Label>{t("grades")}</Label>
      </div>
      <TermSelector
        className="w-full md:w-[300px]"
        showAllOption={true}
        onChange={(val) => {
          void setTermId(val);
        }}
        defaultValue={termId}
      />

      <div className="ml-auto flex flex-row items-center gap-2">
        <ToggleGroup
          defaultValue={view}
          value={view}
          onValueChange={(v) => {
            void setView(v);
          }}
          variant={"outline"}
          type="single"
        >
          <ToggleGroupItem value="by_chronological_order">
            <ListIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="by_subject">
            <LayoutGridIcon />
          </ToggleGroupItem>
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/grades/?id=${params.id}&termId=${termId}&format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon /> {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/grades/?id=${params.id}&termId=${termId}&format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon /> {t("xml_export")}
            </DropdownMenuItem>
            {canDeleteGradesheet && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!params.gradeId}
                  onSelect={async () => {
                    if (!params.gradeId) return;
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("deleting"), { id: 0 });
                      deleteGradeMutation.mutate(Number(params.gradeId));
                    }
                  }}
                >
                  <DeleteIcon />
                  {t("delete")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
