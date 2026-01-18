"use client";

import { useParams } from "next/navigation";
import { ChevronRight, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { StudentStatus } from "@repo/db/enums";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { EnrollmentIcon } from "~/icons";
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

  const canEnroll = useCheckPermission("enrollment", "create");
  const isEnrolled = !!student.classroom;
  const disabled = student.status !== StudentStatus.ACTIVE;

  return (
    <div className="bg-muted/50 flex flex-row items-center gap-6 border-b px-4 py-1">
      <div className="flex items-center gap-2">
        <EnrollmentIcon className="hidden md:flex" />
        <Label>{t("enrollments")}</Label>
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        {!isEnrolled && canEnroll && (
          <Button
            disabled={!schoolYear.isActive || disabled}
            onClick={() => {
              openModal({
                title: t("enrollment"),
                className: "sm:max-w-lg",
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
            <Button size={"icon"} variant={"outline"}>
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
