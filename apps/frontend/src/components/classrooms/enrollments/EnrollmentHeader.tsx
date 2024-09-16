"use client";

import { MoreVertical, Plus } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { api } from "~/trpc/react";
import { getAge } from "~/utils/student-utils";
import { EnrollStudent } from "./EnrollStudent";

export function EnrollmentHeader({ classroomId }: { classroomId: string }) {
  const { t } = useLocale();
  const { openModal } = useModal();

  const classroomStudentsQuery = api.classroom.students.useQuery(classroomId);

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
  return (
    <div className="grid grid-cols-1 items-center gap-2 border-y bg-secondary px-2 py-1 text-secondary-foreground md:flex md:flex-row">
      <FlatBadge
        variant={"yellow"}
        className="flex flex-row items-center gap-2"
      >
        <Label>{t("effective")}: </Label>
        <span className="text-muted-foreground">{students.length}</span>
      </FlatBadge>
      <Separator orientation="vertical" className="h-5" />
      <FlatBadge variant={"green"} className="flex flex-row items-center gap-2">
        <Label>{t("male")}: </Label>
        <span className="text-muted-foreground">
          {male} - ({((male / total) * 100).toFixed()}%)
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="h-5" />
      <FlatBadge
        variant={"indigo"}
        className="flex flex-row items-center gap-2"
      >
        <Label>{t("female")}: </Label>
        <span className="text-muted-foreground">
          {female} - ({((female / total) * 100).toFixed()}%)
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="h-5" />
      <FlatBadge
        variant={"purple"}
        className="flex flex-row items-center gap-2"
      >
        <Label>{t("isRepeating")}: </Label>
        <span className="text-muted-foreground">
          {repeating} - ({((repeating / total) * 100).toFixed()}%)
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="h-5" />
      <FlatBadge variant={"red"} className="flex flex-row items-center gap-2">
        <Label>{t("oldest")}: </Label>
        <span className="text-muted-foreground">
          {youngest} {t("old")}
        </span>
      </FlatBadge>
      <Separator orientation="vertical" className="h-5" />
      <FlatBadge variant={"blue"} className="flex flex-row items-center gap-2">
        <Label>{t("youngest")}: </Label>
        <span className="text-muted-foreground">
          {oldest} {t("old")}
        </span>
      </FlatBadge>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          variant="default"
          size="sm"
          disabled={false}
          onClick={() => {
            openModal({
              title: (
                <div className="px-4 pt-4">{t("enroll_new_students")}</div>
              ),
              className: "w-[600px] p-0",
              description: (
                <p className="px-4">{t("enroll_new_students_description")}</p>
              ),
              view: <EnrollStudent classroomId={classroomId} />,
            });
          }}
        >
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {t("enroll")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                // toast.promise(printStudents(params.id, "excel"), {
                //   loading: t("printing"),
                //   success: () => {
                //     router.push(routes.reports.index);
                //     return t("printed");
                //   },
                //   error: (err) => {
                //     return getErrorMessage(err);
                //   },
                // });
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
