/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { Form } from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

import { AvatarState } from "~/components/AvatarState";
import { useLocale } from "~/i18n";
import { showErrorToast } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { routes } from "../../../configs/routes";

export function AttendanceTable() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const studentsQuery = useQuery(
    trpc.classroom.students.queryOptions(params.id),
  );

  const form = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };
  const { t } = useLocale();
  if (studentsQuery.isPending) {
    return (
      <div className="m-4">
        <DataTableSkeleton
          rowCount={18}
          columnCount={8}
          withPagination={false}
          showViewOptions={false}
        />
      </div>
    );
  }
  if (studentsQuery.isError) {
    showErrorToast(studentsQuery.error);
    return;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-2 rounded-lg border p-0"
      >
        <Table className="mx-0">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[80px]">
                <span className="sr-only">Avatar</span>
              </TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("asbent")}</TableHead>
              <TableHead>{t("lateness")}</TableHead>
              <TableHead>{t("consignes")}</TableHead>
              <TableHead>{t("exclusion")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentsQuery.data.map((student, index) => {
              return (
                <TableRow key={student.id}>
                  <TableCell className="py-0 font-medium">
                    {index + 1}.
                    <Input
                      {...form.register(`students[${index}].id`)}
                      type="hidden"
                      defaultValue={student.id}
                    />
                  </TableCell>
                  <TableCell className="py-0 sm:table-cell">
                    <AvatarState pos={index} avatar={student.user?.avatar} />
                  </TableCell>
                  <TableCell className="py-0 font-medium">
                    <Link
                      className="hover:text-blue-600 hover:underline"
                      href={routes.students.details(student.id)}
                    >
                      {getFullName(student)}
                    </Link>
                  </TableCell>
                  <TableCell className="py-0">
                    <Input
                      {...form.register(`students[${index}].absence`)}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="py-0">
                    <Input
                      {...form.register(`students[${index}].late`)}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="py-0">
                    <Input
                      {...form.register(`students[${index}].consigned`)}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="py-0">
                    <Input
                      {...form.register(`students[${index}].exclusion`)}
                      type="number"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </form>
    </Form>
  );
}
