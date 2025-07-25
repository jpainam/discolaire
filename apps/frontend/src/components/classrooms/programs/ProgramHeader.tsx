"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { MoreVertical, Pencil } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import FlatBadge from "~/components/FlatBadge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

export function ProgramHeader({
  subject,
}: {
  subject: RouterOutputs["subject"]["get"];
}) {
  const { t } = useLocale();
  const params = useParams<{ id: string; subjectId: string }>();

  const pathname = usePathname();
  const canEditSubjectProgram = useCheckPermission(
    "program",
    PermissionAction.UPDATE,
  );
  useEffect(() => {
    const breads = [
      { label: t("programs"), href: routes.classrooms.programs(params.id) },
      {
        label: subject.course.name,
        href: routes.classrooms.programs(params.id) + `/${subject.id}`,
      },
    ];
    if (pathname.includes("create-or-edit")) {
      breads.push({
        label: `${t("create")}/${t("edit")}`,
        href:
          routes.classrooms.programs(params.id) +
          `/${subject.id}/create-or-edit`,
      });
    }
    // setBreadcrumbs(breads);
  }, [params.id, pathname, subject, t]);

  const router = useRouter();

  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-2 border-b px-2 py-1">
      <div className="flex flex-row items-center gap-2">
        <Label>{subject.course.name}</Label>
        <FlatBadge variant={"green"}>
          {t("coeff")}: {subject.coefficient}
        </FlatBadge>
        <FlatBadge variant={"blue"}>
          {t("teacher")}: {subject.teacher?.lastName}
        </FlatBadge>
      </div>

      <div className="ml-auto flex flex-row gap-1">
        {canEditSubjectProgram && (
          <Button
            onClick={() => {
              router.push(
                routes.classrooms.programs(params.id) +
                  `/${subject.id}` +
                  "/create-or-edit",
              );
            }}
            size={"icon"}
            variant={"outline"}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                toast.warning("PDF export is not implemented yet");
              }}
            >
              <PDFIcon className="h- 4 mr-2 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.warning("XML export is not implemented yet");
              }}
            >
              <XMLIcon className="h- 4 mr-2 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
