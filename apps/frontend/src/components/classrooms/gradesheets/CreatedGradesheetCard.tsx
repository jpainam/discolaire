"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, EditIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { UpdateCreatedGradesheet } from "./UpdateCreatedGradesheet";

export function CreatedGradesheetCard({
  gradeSheetId,
  termName,
}: {
  gradeSheetId: number;
  termName?: string;
}) {
  const t = useTranslations();
  const { openModal } = useModal();
  const trpc = useTRPC();

  const gradeSheetQuery = useQuery(
    trpc.gradeSheet.get.queryOptions(gradeSheetId),
  );

  const { total, avgGrade, maxGrade, minGrade } = useMemo(() => {
    const grades =
      gradeSheetQuery.data?.grades.filter((g) => !g.isAbsent) ?? [];
    const total = grades.length;

    const minGrade = Math.min(...grades.map((g) => g.grade));
    const maxGrade = Math.max(...grades.map((g) => g.grade));
    const avgGrade =
      grades.length === 0
        ? 0
        : grades.reduce((acc, g) => acc + g.grade, 0) / grades.length;

    return { total, maxGrade, minGrade, avgGrade };
  }, [gradeSheetQuery.data?.grades]);

  const canDeleteGradesheet = useCheckPermission("gradesheet.delete");
  const canUpdateGradesheet = useCheckPermission("gradesheet.update");

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const deleteGradesheetMutation = useMutation(
    trpc.gradeSheet.delete.mutationOptions({
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(`/classrooms/${params.id}/gradesheets`);
      },
      onError: (err) => {
        toast.error(err.message, { id: 0 });
      },
    }),
  );
  const confirm = useConfirm();
  const locale = useLocale();

  const gs = gradeSheetQuery.data;
  if (!gs) {
    return <></>;
  }
  const isClosed = !gs.term.isActive;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {gs.name}
          {termName && <> / {termName}</>}
        </CardTitle>
        <CardDescription>
          <div>{gs.subject.course.name}</div>
          <div>{getFullName(gs.subject.teacher)}</div>
          <div className="text-xs italic">
            {t("scale")}: {gs.scale} - {t("weight")}: {gs.weight * 100}% -{" "}
            {gs.createdAt.toLocaleDateString(locale, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon-sm"} variant={"outline"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/classrooms/${params.id}/gradesheets/${gs.id}`);
                }}
              >
                <ViewIcon />
                {t("details")}
              </DropdownMenuItem>
              {canUpdateGradesheet && (
                <DropdownMenuItem
                  disabled={isClosed}
                  onSelect={() => {
                    openModal({
                      title: "Modifier la fiche de notes",
                      view: (
                        <UpdateCreatedGradesheet
                          gradeSheetId={gs.id}
                          title={gs.name}
                          scale={gs.scale}
                          weight={gs.weight * 100}
                        />
                      ),
                    });
                  }}
                >
                  <EditIcon />
                  {t("edit")}
                </DropdownMenuItem>
              )}

              {canDeleteGradesheet && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isClosed}
                    onSelect={async () => {
                      await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),

                        onConfirm: async () => {
                          await deleteGradesheetMutation.mutateAsync(gs.id);
                        },
                      });
                    }}
                  >
                    <DeleteIcon />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Badge variant={"success"} appearance={"outline"}>
          {total} / {gs.grades.length}
        </Badge>
        <Badge variant={"info"} appearance={"outline"}>
          {t("max")}: {maxGrade}
        </Badge>
        <Badge variant={"warning"} appearance={"outline"}>
          {t("min")}: {minGrade}
        </Badge>
        <Badge variant={"primary"} appearance={"outline"}>
          {t("avg")}: {avgGrade.toFixed(2)}
        </Badge>
      </CardContent>
    </Card>
  );
}
