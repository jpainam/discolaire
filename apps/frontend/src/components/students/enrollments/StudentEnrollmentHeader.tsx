"use client";

import { ArrowRightLeft, ChevronRight, MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { EnrollStudentModal } from "./EnrollStudentModal";

export function StudentEnrollmentHeader({ studentId }: { studentId: string }) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: student } = useSuspenseQuery(
    trpc.student.get.queryOptions(studentId)
  );
  const { openModal } = useModal();
  const params = useParams<{ id: string }>();

  const canEnroll = useCheckPermission("enrollment", PermissionAction.CREATE);
  const isEnrolled = !!student.classroom;

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-muted text-muted-foreground px-4 py-1">
      <ArrowRightLeft className="h-4 w-4" />
      <Label>{t("enrollments")}</Label>
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
