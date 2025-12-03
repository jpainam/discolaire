"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Eye,
  FileTextIcon,
  MoreHorizontal,
  PencilIcon,
  Trash,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { Skeleton } from "@repo/ui/components/skeleton";

import { Badge } from "~/components/base-badge";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { UpdateCreatedGradesheet } from "./UpdateCreatedGradesheet";

export function CurrentGradeSheetSummary({
  termId,
  subjectId,
}: {
  termId: string;
  subjectId: number;
}) {
  const trpc = useTRPC();

  const previousGradesheetQuery = useQuery(
    trpc.gradeSheet.all.queryOptions({
      termId,
      subjectId,
    }),
  );

  if (previousGradesheetQuery.isPending) {
    return (
      <div className="pt-2 pr-2">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  const gradesheets = previousGradesheetQuery.data;
  if (!gradesheets || gradesheets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>Aucune notes</EmptyTitle>
          <EmptyDescription>
            Vous n'avez aucune notes pour cette période
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-2 pr-2">
      {gradesheets.map((gs) => {
        return <CreatedGradesheetCard gradeSheetId={gs.id} key={gs.id} />;
      })}
    </div>
  );
}

function CreatedGradesheetCard({ gradeSheetId }: { gradeSheetId: number }) {
  const t = useTranslations();
  const { openModal } = useModal();
  const trpc = useTRPC();
  const gradeSheetQuery = useQuery(
    trpc.gradeSheet.get.queryOptions(gradeSheetId),
  );

  const { total, avgGrade, maxGrade, minGrade, graded } = useMemo(() => {
    const grades = gradeSheetQuery.data?.grades ?? [];
    const total = grades.length;
    const graded = grades.filter((g) => g.isAbsent).length;

    const maxGrade = Math.min(...grades.map((g) => g.grade));
    const minGrade = Math.max(...grades.map((g) => g.grade));
    const avgGrade =
      grades.length === 0
        ? 0
        : grades.reduce((acc, g) => acc + g.grade, 0) / grades.length;

    return { total, maxGrade, minGrade, avgGrade, graded };
  }, [gradeSheetQuery.data?.grades]);

  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE,
  );

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
    <Card>
      <CardHeader>
        <CardTitle>{gs.name}</CardTitle>
        <CardDescription>
          <div>{gs.subject.course.name}</div>
          <div>{getFullName(gs.subject.teacher)}</div>
          <div className="font-bold">
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
              <Button variant={"outline"} size={"sm"} className="size-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/classrooms/${params.id}/gradesheets/${gs.id}`);
                }}
              >
                <Eye className="h-4 w-4" />
                {t("details")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isClosed || !canDeleteGradesheet}
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
                <PencilIcon className="h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                disabled={!canDeleteGradesheet || isClosed}
                onSelect={async () => {
                  const isConfirmed = await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                  });
                  if (isConfirmed) {
                    toast.loading(t("deleting"), { id: 0 });
                    deleteGradesheetMutation.mutate(gs.id);
                  }
                }}
              >
                <Trash className="text-destructive h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Badge variant={"success"} appearance={"outline"}>
          {t("effectif")} : {graded} / {total}
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
