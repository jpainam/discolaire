"use client";

import { useParams } from "next/navigation";
import { ArrowRightLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { StudentStatus } from "@repo/db/enums";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useSchool } from "~/providers/SchoolProvider";
import { EnrollStudentModal } from "./EnrollStudentModal";

export function StudentEnrollmentHeader({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const t = useTranslations();

  const { openModal } = useModal();
  const params = useParams<{ id: string }>();
  const { schoolYear } = useSchool();

  const canEnroll = useCheckPermission("enrollment", PermissionAction.CREATE);
  const isEnrolled = !!student.classroom;
  const disabled = student.status !== StudentStatus.ACTIVE;

  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-2 border-b px-4 py-1">
      <ArrowRightLeft className="h-4 w-4" />
      <Label>{t("enrollments")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {!isEnrolled && canEnroll && (
          <Button
            size={"sm"}
            disabled={!schoolYear.isActive || disabled}
            onClick={() => {
              openModal({
                title: t("enrollment"),

                description: t("enroll_student_description"),
                view: <EnrollStudentModal studentId={params.id} />,
              });
            }}
            variant="default"
          >
            <ChevronRight />
            {t("enroll")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="size-8" variant={"outline"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
