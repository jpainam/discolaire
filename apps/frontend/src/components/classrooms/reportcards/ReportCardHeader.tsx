"use client";

import { useParams, usePathname } from "next/navigation";
import { MentoringIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDown, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { TrimestreSelector } from "~/components/shared/selects/TrimestreSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import {
  EnrollmentIcon,
  FileIcon,
  FilesIcon,
  MoreIcon,
  UserIcon,
  UsersIcon,
} from "~/icons";
import { PermissionAction } from "~/permissions";
import { reportcardSearchParamsSchema } from "~/utils/search-params";
import { sidebarIcons } from "../sidebar-icons";

export function ReportCardHeader() {
  const t = useTranslations();
  const { createQueryString } = useCreateQueryString();

  const [searchParams, setSearchParams] = useQueryStates(
    reportcardSearchParamsSchema,
  );
  const { termId, trimestreId } = searchParams;
  const pathname = usePathname();
  const canCreateReportCard = useCheckPermission(
    "repordcard",
    PermissionAction.CREATE,
  );

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const Icon = sidebarIcons.reportcards;

  return (
    <div className="bg-muted/40 grid flex-row items-center gap-4 border-b px-4 py-1 md:flex">
      {Icon && <Icon className="hidden h-4 w-4 md:block" />}
      <Label className="hidden md:block">{t("term")}</Label>
      <TermSelector
        className="md:w-[350px]"
        defaultValue={termId}
        onChange={(val) => {
          void setSearchParams({
            termId: val,
            trimestreId: null,
            action: null,
          });
        }}
      />
      <Label className="hidden md:block">{t("Trimestre")}</Label>
      <TrimestreSelector
        className="w-[300px]"
        defaultValue={trimestreId ?? undefined}
        onChange={(val) => {
          if (val == "ann") {
            router.push(`/classrooms/${params.id}/reportcards/annual`);
          } else {
            const url =
              `/classrooms/${params.id}/reportcards/trimestres?` +
              createQueryString({
                trimestreId: val,
                classroomId: params.id,
                format: "pdf",
              });
            router.push(url);
          }
        }}
      />
      <div className="flex flex-row items-center gap-2 md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Actions
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <MoreIcon className="size-4" />
              Appréciations
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                if (!searchParams.termId && !searchParams.trimestreId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                void setSearchParams({
                  action: "subjects",
                });
              }}
            >
              <UsersIcon />
              Professeurs / Matières
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!searchParams.termId && !searchParams.trimestreId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                void setSearchParams({
                  action: "teacher",
                });
              }}
            >
              <UserIcon />
              Prof. Principal
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!searchParams.termId && !searchParams.trimestreId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                void setSearchParams({
                  action: "overall_appreciation",
                });
              }}
            >
              <FilesIcon />
              Générales
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2">
              <FileIcon className="size-4" />
              Conseils / Programmes
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                if (!searchParams.termId && !searchParams.trimestreId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                void setSearchParams({
                  action: "class_council",
                });
              }}
            >
              <HugeiconsIcon icon={MentoringIcon} strokeWidth={2} />
              Conseil de classe
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!searchParams.termId && !searchParams.trimestreId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                void setSearchParams({
                  action: "skills",
                });
              }}
            >
              <EnrollmentIcon />
              Compétences évaluées
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            {canCreateReportCard && (
              <DropdownMenuItem
                disabled={!termId && !trimestreId}
                onSelect={() => {
                  let url = `/api/pdfs/reportcards/ipbw?classroomId=${params.id}&termId=${termId}`;
                  if (pathname.includes("/trimestres")) {
                    url = `/api/pdfs/reportcards/ipbw/trimestres?trimestreId=${trimestreId}&classroomId=${params.id}&format=pdf`;
                  }
                  window.open(url, "_blank");
                }}
              >
                <PDFIcon />
                {t("pdf_export")}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
