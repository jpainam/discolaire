"use client";

import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { EnrollStudentModal } from "./EnrollStudentModal";

export function StudentEnrollmentHeader({
  isEnrolled,
}: {
  isEnrolled: boolean;
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();

  return (
    <div className="flex flex-row items-center border-b bg-secondary px-2 py-1">
      <Label>{t("enrollments")}</Label>
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
        <Button variant="outline" className="opacity-0">
          {t("export")}
        </Button>
      </div>
    </div>
  );
}
