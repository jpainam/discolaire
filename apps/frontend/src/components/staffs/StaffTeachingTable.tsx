"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { EmptyComponent } from "~/components/EmptyComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StaffTeachingTable({ staffId }: { staffId: string }) {
  const trpc = useTRPC();

  const { data: teachings } = useSuspenseQuery(
    trpc.staff.teachings.queryOptions(staffId),
  );
  const t = useTranslations();
  if (teachings.length === 0) {
    return <EmptyComponent />;
  }

  return (
    <div className="m-2 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead>{t("classroom")}</TableHead>
            <TableHead>{t("head_teacher")}</TableHead>
            <TableHead>{t("course")}</TableHead>
            <TableHead>{t("group")}</TableHead>
            <TableHead>{t("coefficient")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachings.map((teaching, index) => {
            return (
              <TableRow key={teaching.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-row items-center space-x-1">
                    <div
                      className="flex h-4 w-4 rounded-full"
                      style={{
                        backgroundColor: teaching.course.color,
                      }}
                    ></div>
                    <Link
                      className="hover:underline"
                      href={`/classrooms/${teaching.classroomId}`}
                    >
                      {teaching.classroom.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hover:underline">
                  <Link href={`/staffs/${teaching.classroom.headTeacherId}`}>
                    {getFullName(teaching.classroom.headTeacher)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Link
                    className="hover:underline"
                    href={`/classrooms/${teaching.classroomId}/subjects/${teaching.id}`}
                  >
                    {teaching.course.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {teaching.subjectGroup?.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {teaching.coefficient}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
