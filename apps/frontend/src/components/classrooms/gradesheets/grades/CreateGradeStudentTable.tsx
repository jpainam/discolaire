"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";

import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { EmptyState } from "@repo/ui/EmptyState";
import { Input } from "@repo/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { getAppreciations } from "~/utils/get-appreciation";

export function CreateGradeStudentTable() {
  const params = useParams<{ id: string }>();
  const classroomStudentsQuery = api.classroom.students.useQuery(params.id);

  const { t } = useLocale();
  if (classroomStudentsQuery.isPending) {
    return <DataTableSkeleton rowCount={10} columnCount={8} />;
  }
  if (classroomStudentsQuery.isError) {
    showErrorToast(classroomStudentsQuery.error);
    return null;
  }
  if (!classroomStudentsQuery.data) {
    return <EmptyState title={t("no_data")} />;
  }
  return (
    <div className="mx-2 border">
      <Table className="border-1 rounded-sm border">
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("grade")}</TableHead>
            <TableHead>{t("appreciation")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classroomStudentsQuery.data.map((st, index) => {
            return (
              <TableRow
                key={st.id}
                className="hover:bg-green-50 hover:text-green-700 hover:ring-green-600/20 dark:hover:bg-green-700/10 dark:hover:text-green-50"
              >
                <TableCell className="py-0">
                  <div className="flex flex-row items-center gap-1">
                    <AvatarState
                      avatar={st.avatar}
                      pos={getFullName(st).length}
                    />

                    <span>{index + 1}.</span>
                    <Link
                      className="hover:text-blue-600 hover:underline"
                      href={routes.students.details(st.id)}
                    >
                      {getFullName(st)}
                    </Link>
                  </div>
                </TableCell>
                <GradeTableRow studentId={st.id} index={index} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function GradeTableRow({
  studentId,
  index,
}: {
  studentId: string;
  index: number;
}) {
  const watchValue = useWatch({ name: `grades.${index}` }) as {
    id: string;
    grade: string;
  };
  const { register } = useFormContext();
  return (
    <>
      <TableCell className="py-0">
        <Input
          value={studentId}
          className="hidden"
          {...register(`grades.${index}.id`)}
        />
        <Input
          {...register(`grades.${index}.grade`)}
          maxLength={6}
          size={6}
          step=".01"
          type="number"
          className="h-8 w-[100px] text-sm"
        />
      </TableCell>
      <TableCell className="py-0">
        {watchValue.grade && getAppreciations(Number(watchValue.grade))}
      </TableCell>
    </>
  );
}
