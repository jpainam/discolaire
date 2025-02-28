"use client";

import { MoreVertical, Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { getAge } from "~/utils/student-utils";
import { EnrollStudent } from "./EnrollStudent";

export function EnrollmentHeader({ classroomId }: { classroomId: string }) {
  const { t } = useLocale();
  const { openModal } = useModal();

  const classroomStudentsQuery = api.classroom.students.useQuery(classroomId);
  const classroomQuery = api.classroom.get.useQuery(classroomId);
  const classroom = classroomQuery.data;

  const canEnroll = useCheckPermissions(
    PermissionAction.CREATE,
    "classroom:enrollment",
    {
      id: classroomId,
    },
  );

  const students = classroomStudentsQuery.data ?? [];
  const male = students.filter((student) => student.gender == "male").length;
  const total = students.length || 1e9;
  const female = students.length - male;

  const repeating = students.filter((student) => student.isRepeating).length;
  const oldest =
    students.length > 0
      ? Math.max(...students.map((student) => getAge(student.dateOfBirth) || 0))
      : 0;
  const youngest =
    students.length > 0
      ? Math.min(...students.map((student) => getAge(student.dateOfBirth) || 0))
      : 0;

  if (classroomStudentsQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 px-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  if (!classroom) return null;
  return (
    <div className="grid grid-cols-3 items-center gap-2 border-y bg-secondary px-4 py-1 text-secondary-foreground md:flex md:flex-row">
      <FlatBadge
        variant={"yellow"}
        className="flex flex-row items-center gap-2"
      >
        <Label>{t("effective")}: </Label>
        <span className="text-muted-foreground">{students.length}</span>
      </FlatBadge>
      <Separator orientation="vertical" className="hidden h-5 md:block" />
      <FlatBadge variant={"green"} className="flex flex-row items-center gap-2">
        <Label>{t("male")}: </Label>
        <span className="text-muted-foreground">
          {male} - ({((male / total) * 100).toFixed()}%)
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="hidden h-5 md:block" />
      <FlatBadge
        variant={"indigo"}
        className="flex flex-row items-center gap-2"
      >
        <Label>{t("female")}: </Label>
        <span className="text-muted-foreground">
          {female} - ({((female / total) * 100).toFixed()}%)
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="hidden h-5 md:block" />
      <FlatBadge
        variant={"purple"}
        className="flex flex-row items-center gap-2"
      >
        <Label>{t("isRepeating")}: </Label>
        <span className="text-muted-foreground">
          {repeating} - ({((repeating / total) * 100).toFixed()}%)
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="hidden h-5 md:block" />
      <FlatBadge variant={"red"} className="flex flex-row items-center gap-2">
        <Label>{t("oldest")}: </Label>
        <span className="text-muted-foreground">
          {youngest} {t("old")}
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="hidden h-5 md:block" />
      <FlatBadge variant={"blue"} className="flex flex-row items-center gap-2">
        <Label>{t("youngest")}: </Label>
        <span className="text-muted-foreground">
          {oldest} {t("old")}
        </span>
      </FlatBadge>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canEnroll && (
          <Button
            variant="default"
            size="sm"
            disabled={false}
            onClick={() => {
              openModal({
                title: <p className="px-4 pt-4">{t("enroll_new_students")}</p>,
                className: "w-[600px] p-0",
                description: (
                  <p className="px-4">{t("enroll_new_students_description")}</p>
                ),
                view: <EnrollStudent classroomId={classroomId} />,
              });
            }}
          >
            <Plus />
            {t("enroll")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={classroomQuery.isPending}
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/students?id=${classroomId}&preview=true&size=a4&format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/students?id=${classroomId}&preview=true&size=a4&format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
