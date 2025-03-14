"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import type { FlatBadgeVariant } from "~/components/FlatBadge";
import FlatBadge from "~/components/FlatBadge";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import { useParams } from "next/navigation";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useCheckPermission } from "~/hooks/use-permission";
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditSubject } from "./CreateEditSubject";

export function SubjectHeader({
  subjects,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  const Icon = sidebarIcons.subjects;
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
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
    <div className="grid w-full grid-cols-1 flex-row items-center gap-2 border-b bg-muted px-4 py-1 text-secondary-foreground md:flex">
      {Icon && <Icon className="hidden h-6 w-6 md:block" />}
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
        <Separator orientation="vertical" />
        <FlatBadge variant={"pink"}>
          {coeff} {t("coefficient")}
        </FlatBadge>
      </div>
      <div className="grid flex-row items-center gap-1 md:ml-auto md:flex">
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
