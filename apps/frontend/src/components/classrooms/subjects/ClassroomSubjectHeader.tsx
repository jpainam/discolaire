"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { FlatBadgeVariant } from "~/components/FlatBadge";
import FlatBadge from "~/components/FlatBadge";
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
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditSubject } from "./CreateEditSubject";

export function ClassroomSubjectHeader() {
  const trpc = useTRPC();

  const params = useParams<{ id: string }>();
  const { data: subjects } = useSuspenseQuery(
    trpc.classroom.subjects.queryOptions(params.id),
  );
  const Icon = sidebarIcons.subjects;

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

  const badgeVariants = [
    "blue",
    "red",
    "yellow",
    "gray",
    "purple",
  ] as FlatBadgeVariant[];

  return (
    <div className="bg-muted text-muted-foreground grid w-full grid-cols-1 flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      {Icon && <Icon className="hidden h-4 w-4 md:block" />}
      <Label className="hidden md:block">{t("subjects")}</Label>
      <div className="grid grid-cols-3 flex-row items-center gap-2 md:flex">
        <FlatBadge variant={"indigo"}>
          {subjects.length} {t("subjects")}
        </FlatBadge>
        <FlatBadge variant={"green"}>
          {nbTeacher} {t("teachers")}
        </FlatBadge>
        {Object.keys(groups).map((key, index) => {
          return (
            <FlatBadge
              key={key}
              variant={badgeVariants[index % badgeVariants.length]}
            >
              {groups[key]} {key}
            </FlatBadge>
          );
        })}

        <FlatBadge variant={"pink"}>
          {coeff} {t("coefficient")}
        </FlatBadge>
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canAddClassroomSubject && (
          <Button
            size={"sm"}
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
