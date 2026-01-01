"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

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
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { SubjectIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { CreateEditSubject } from "./CreateEditSubject";

export function ClassroomSubjectHeader() {
  const trpc = useTRPC();

  const params = useParams<{ id: string }>();
  const { data: subjects } = useSuspenseQuery(
    trpc.classroom.subjects.queryOptions(params.id),
  );

  const t = useTranslations();

  const v = new Set<string>(subjects.map((s) => s.teacherId ?? ""));
  const nbTeacher = v.size;
  const groups: Record<string, number> = {};
  const coeff = subjects.map((s) => s.coefficient).reduce((a, b) => a + b, 0);
  subjects.forEach((s) => {
    if (s.subjectGroup) {
      const name = s.subjectGroup.name;
      if (name && groups[name]) {
        groups[name]++;
      } else {
        groups[name] = 1;
      }
    }
  });

  const { openSheet } = useSheet();
  const canAddClassroomSubject = useCheckPermission(
    "subject",
    PermissionAction.CREATE,
  );

  return (
    <div className="bg-muted text-muted-foreground grid w-full grid-cols-1 flex-row items-center gap-4 border-b px-4 py-1 md:flex">
      <div className="flex items-center gap-2">
        <SubjectIcon />
        <Label className="hidden md:block">{t("subjects")}</Label>
      </div>
      <div className="grid grid-cols-3 flex-row items-center gap-2 md:flex">
        <Badge variant={"info"} appearance={"outline"}>
          {subjects.length} {t("subjects")}
        </Badge>
        <Badge variant={"success"} appearance={"outline"}>
          {nbTeacher} {t("teachers")}
        </Badge>
        {/* {Object.keys(groups).map((key, index) => {
          return (
            <Badge
              key={key}
              variant={otherBadgeVariants[index % otherBadgeVariants.length]}
              appearance={"outline"}
            >
              {key}
            </Badge>
          );
        })} */}

        <Badge variant={"warning"} appearance={"outline"}>
          {coeff} {t("coefficient")}
        </Badge>
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canAddClassroomSubject && (
          <Button
            onClick={() => {
              openSheet({
                title: (
                  <>
                    {t("create")}-{t("subject")}
                  </>
                ),
                view: <CreateEditSubject />,
              });
            }}
            variant={"default"}
          >
            <PlusIcon />
            {t("add")}
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
                  `/api/pdfs/classroom/${params.id}/subjects?format=csv`,
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
                  `/api/pdfs/classroom/${params.id}/subjects?format=pdf`,
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
