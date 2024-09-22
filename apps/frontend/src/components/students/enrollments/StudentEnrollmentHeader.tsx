"use client";

import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

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

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1">
      {Icon && <Icon className="h-6 w-6" />}
      <Label className="py-2.5">{t("enrollments")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {!isEnrolled && (
          <Button
            onClick={() => {
              openModal({
                title: t("enrollment"),
                className: "w-[400px]",
                description: t("enroll_student_description"),
                view: <EnrollStudentModal studentId={params.id} />,
              });
            }}
            variant="outline"
          >
            <ChevronRight className="mr-2 h-4 w-4" />
            {t("enroll")}
          </Button>
        )}
      </div>
    </div>
  );
}
