"use client";

import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import { useCheckPermission } from "~/hooks/use-permission";
import { sidebarIcons } from "../sidebar-icons";
import { EnrollStudentModal } from "./EnrollStudentModal";

export function StudentEnrollmentHeader({
  isEnrolled,
}: {
  isEnrolled: boolean;
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();
  const Icon = sidebarIcons.enrollments;
  const canEnroll = useCheckPermission("enrollment", PermissionAction.CREATE);

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1">
      {Icon && <Icon className="hidden md:block h-4 w-4" />}
      <Label className="hidden md:block">{t("enrollments")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {!isEnrolled && canEnroll && (
          <Button
            size={"sm"}
            onClick={() => {
              openModal({
                title: t("enrollment"),

                description: t("enroll_student_description"),
                view: <EnrollStudentModal studentId={params.id} />,
              });
            }}
            variant="outline"
          >
            <ChevronRight />
            {t("enroll")}
          </Button>
        )}
      </div>
    </div>
  );
}
