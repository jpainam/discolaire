"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, MoreHorizontal, PencilIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
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
import { Skeleton } from "@repo/ui/components/skeleton";

import { Badge } from "~/components/base-badge";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { createGradeSheetSearchSchema } from "./search-params";
import { UpdateCreatedGradesheet } from "./UpdateCreatedGradesheet";

export function PreviousCreatedGradeSheet() {
  const [searchParams, _] = useQueryStates(createGradeSheetSearchSchema);
  const trpc = useTRPC();

  const createdGradesheetQuery = useQuery(
    trpc.gradeSheet.all.queryOptions({
      termId: searchParams.termId,
      subjectId: searchParams.subjectId,
    }),
  );

  if (createdGradesheetQuery.isPending) {
    return (
      <div className="pt-2 pr-2">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  const gradesheets = createdGradesheetQuery.data;
  if (!gradesheets || gradesheets.length === 0) {
    return (
      <div className="flex flex-col gap-4 pt-4 pr-4">
        <EmptyState title={"Aucune notes précédentes<"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-2 pr-2">
      <div className="font-bold font-medium">Notes Précèdentes</div>
      {gradesheets.map((gs) => {
        const total = gs.grades.length;
        const graded =
          gs.grades.length + gs.grades.filter((g) => g.isAbsent).length;

        const maxGrade = Math.min(...gs.grades.map((g) => g.grade));
        const minGrade = Math.max(...gs.grades.map((g) => g.grade));
        const avgGrade =
          gs.grades.length === 0
            ? 0
            : gs.grades.reduce((acc, g) => acc + g.grade, 0) / gs.grades.length;

        return (
          <CreatedGradesheetCard
            key={gs.id}
            id={gs.id}
            total={total}
            graded={graded}
            weight={gs.weight}
            title={gs.name}
            maxGrade={maxGrade}
            minGrade={minGrade}
            avgGrade={avgGrade}
            scale={gs.scale}
            isClosed={!gs.term.isActive}
            subject={gs.subject.course.name}
            prof={`${gs.subject.teacher?.prefix} ${gs.subject.teacher?.firstName ?? ""} ${
              gs.subject.teacher?.lastName ?? ""
            }`}
          />
        );
      })}
    </div>
  );
}

function CreatedGradesheetCard({
  total,
  title,
  id,
  graded,
  subject,
  prof,
  maxGrade,
  minGrade,
  avgGrade,
  scale,
  weight,
  isClosed,
}: {
  title: string;
  id: number;
  total: number;
  graded: number;
  subject: string;
  prof: string;
  maxGrade: number;
  minGrade: number;
  avgGrade: number;
  scale: number;
  weight: number;
  isClosed: boolean;
}) {
  const t = useTranslations();
  const { openModal } = useModal();
  const canDeleteGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.DELETE,
  );
  const trpc = useTRPC();
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <div>{subject}</div> <div>{prof}</div>
          <div className="font-bold">
            {t("scale")}: {scale} - {t("weight")}: {weight * 100}%
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
                  router.push(`/classrooms/${params.id}/gradesheets/${id}`);
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
                        gradeSheetId={id}
                        title={title}
                        scale={scale}
                        weight={weight * 100}
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
                    deleteGradesheetMutation.mutate(id);
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
