"use client";

import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { useModal } from "~/hooks/use-modal";
import { EnrollStudentModal } from "./EnrollStudentModal";

export function StudentEnrollmentHeader({
  isEnrolled,
}: {
  isEnrolled: boolean;
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const params = useParams() as { id: string };

  return (
    <div className="flex flex-row items-center border-b bg-secondary px-2 py-1">
      <Label>{t("enrollments")}</Label>
      <div className="ml-auto flex h-10 flex-row gap-2">
        {!isEnrolled && (
          <Button
            onClick={() => {
              openModal({
                title: <div className="px-2">{t("enrollment")}</div>,
                description: (
                  <div className="px-2">{t("enroll_student_description")} </div>
                ),
                view: <EnrollStudentModal studentId={params.id} />,
              });
            }}
            size="sm"
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
