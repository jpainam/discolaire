"use client";

import { MoreVertical, Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSession } from "~/providers/AuthProvider";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { getAge } from "~/utils";
import { EnrollStudent } from "./EnrollStudent";

export function EnrollmentHeader() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(params.id),
  );
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  const { t } = useLocale();
  const { openModal } = useModal();

  const session = useSession();
  const { school } = useSchool();
  const router = useRouter();
  const canUpdateSchool = useCheckPermission("school", PermissionAction.UPDATE);

  const canEnroll = useCheckPermission("enrollment", PermissionAction.CREATE);

  const { male, female, total } = useMemo(() => {
    const male = students.filter((student) => student.gender == "male").length;
    const total = students.length || 1e9;
    const female = students.length - male;

    return { male, female, total };
  }, [students]);

  const { repeating, oldest, youngest } = useMemo(() => {
    const repeating = students.filter((student) => student.isRepeating).length;
    const oldest =
      students.length > 0
        ? Math.max(
            ...students.map((student) => getAge(student.dateOfBirth) || 0),
          )
        : 0;
    const youngest =
      students.length > 0
        ? Math.min(
            ...students.map((student) => getAge(student.dateOfBirth) || 0),
          )
        : 0;

    return { repeating, oldest, youngest };
  }, [students]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 items-center gap-2 border-y bg-secondary px-4 py-1 text-secondary-foreground md:flex md:flex-row">
        <FlatBadge
          variant={"yellow"}
          className="flex flex-row items-center gap-2"
        >
          <Label>{t("effective")}: </Label>
          <span className="text-muted-foreground">{classroom.size}</span>
        </FlatBadge>
        {session.user?.profile == "staff" && (
          <>
            <Separator orientation="vertical" className="hidden h-5 md:block" />
            <FlatBadge
              variant={"green"}
              className="flex flex-row items-center gap-2"
            >
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
            <FlatBadge
              variant={"red"}
              className="flex flex-row items-center gap-2"
            >
              <Label>{t("oldest")}: </Label>
              <span className="text-muted-foreground">
                {youngest} {t("old")}
              </span>
            </FlatBadge>
            <Separator orientation="vertical" className="hidden h-5 md:block" />
            <FlatBadge
              variant={"blue"}
              className="flex flex-row items-center gap-2"
            >
              <Label>{t("youngest")}: </Label>
              <span className="text-muted-foreground">
                {oldest} {t("old")}
              </span>
            </FlatBadge>
          </>
        )}

        <div className="ml-auto flex flex-row items-center gap-2">
          {canEnroll && (
            <Button
              variant="default"
              size="sm"
              disabled={false}
              onClick={() => {
                if (
                  !school.allowOverEnrollment &&
                  classroom.size >= classroom.maxSize
                ) {
                  toast.warning(
                    t(
                      "Allow enrollments in classrooms that exceed the maximum size",
                    ),
                    {
                      position: "top-center",
                      duration: 5000,
                      className: "w-[300px]",
                      action: canUpdateSchool
                        ? {
                            label: t("Authorize"),
                            onClick: () =>
                              router.push(
                                `/administration/my-school/${school.id}`,
                              ),
                          }
                        : undefined,
                    },
                  );
                  return;
                }
                openModal({
                  title: (
                    <p className="px-4 pt-4">{t("enroll_new_students")}</p>
                  ),
                  className: "p-0",
                  description: (
                    <span className="px-4">
                      {t("enroll_new_students_description")}
                    </span>
                  ),
                  view: <EnrollStudent classroomId={classroom.id} />,
                });
              }}
            >
              <Plus />
              {t("enroll")}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="size-8" size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `/api/pdfs/classroom/students?id=${classroom.id}&preview=true&size=a4&format=csv`,
                    "_blank",
                  );
                }}
              >
                <XMLIcon />
                {t("xml_export")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `/api/pdfs/classroom/students?id=${classroom.id}&preview=true&size=a4&format=pdf`,
                    "_blank",
                  );
                }}
              >
                <PDFIcon />
                {t("pdf_export")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
