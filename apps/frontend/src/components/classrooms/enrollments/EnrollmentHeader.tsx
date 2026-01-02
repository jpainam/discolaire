"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { authClient } from "~/auth/client";
import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { PermissionAction } from "~/permissions";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { getAge } from "~/utils";
import { EnrollStudent } from "./EnrollStudent";

export function EnrollmentHeader({ className }: { className?: string }) {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(params.id),
  );
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );

  const t = useTranslations();
  const { openModal } = useModal();
  const { schoolYear } = useSchool();

  const { data: session } = authClient.useSession();
  const { school } = useSchool();
  const router = useRouter();
  const canUpdateSchool = useCheckPermission("school", PermissionAction.UPDATE);

  const canEnroll = useCheckPermission("enrollment", PermissionAction.CREATE);

  const { male, female } = useMemo(() => {
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
    <div
      className={cn(
        "bg-muted text-secondary-foreground grid grid-cols-2 items-center gap-4 px-4 py-1 md:flex md:flex-row",
        className,
      )}
    >
      <Badge variant={"warning"} appearance={"outline"}>
        {t("effective")}:{classroom.size}
      </Badge>
      {session?.user.profile == "staff" && (
        <>
          <Badge variant={"success"} appearance={"outline"}>
            {t("male")} : {male}
          </Badge>

          <Badge variant={"info"} appearance={"outline"}>
            {t("female")} : {female}
          </Badge>
          <Badge variant={"destructive"} appearance={"outline"}>
            {t("isRepeating")} : {repeating}
          </Badge>

          <Badge variant={"primary"} appearance={"outline"}>
            {t("youngest")} : {youngest} {t("old")}
          </Badge>

          <Badge variant={"warning"} appearance={"outline"}>
            {t("oldest")} : {oldest} {t("old")}
          </Badge>
        </>
      )}

      <div className="ml-auto flex flex-row items-center gap-2">
        {canEnroll && (
          <Button
            disabled={!schoolYear.isActive}
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
                title: <p className="px-4 pt-4">{t("enroll_new_students")}</p>,
                className: "p-0 sm:max-w-lg",
                description: <span className="px-4">{classroom.name}</span>,
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
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
  );
}
