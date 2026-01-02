"use client";

import { useParams } from "next/navigation";
import { MentoringIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { TermSelector } from "~/components/shared/selects/TermSelector";
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
import { useRouter } from "~/hooks/use-router";
import {
  EnrollmentIcon,
  FileIcon,
  FilesIcon,
  MoreIcon,
  ReportGradeIcon,
  UserIcon,
  UsersIcon,
} from "~/icons";
import { sidebarIcons } from "../sidebar-icons";

export function ReportCardHeader() {
  const t = useTranslations();
  const { createQueryString } = useCreateQueryString();

  const [termId] = useQueryState("termId");

  const params = useParams<{ id: string }>();
  const Icon = sidebarIcons.reportcards;
  const router = useRouter();

  return (
    <div className="bg-muted/40 grid flex-row items-center gap-4 border-y px-4 py-1 md:flex">
      {Icon && <Icon className="hidden h-4 w-4 md:block" />}
      <Label className="hidden md:block">{t("term")}</Label>
      <TermSelector
        className="md:w-[350px]"
        defaultValue={termId}
        onChange={(val) => {
          router.push(
            `/classrooms/${params.id}/reportcards?` +
              createQueryString({ action: "reportcard", termId: val }),
          );
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
            <DropdownMenuItem
              onSelect={() => {
                if (!termId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                router.push(
                  `/classrooms/${params.id}/reportcards?` +
                    createQueryString({
                      action: "reportcard",
                      termId: termId,
                    }),
                );
              }}
            >
              <ReportGradeIcon />
              {t("reportcards")}
            </DropdownMenuItem>
            <DropdownMenuLabel className="flex items-center gap-2">
              <MoreIcon className="size-4" />
              Appréciations
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                if (!termId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                router.push(
                  `/classrooms/${params.id}/reportcards?` +
                    createQueryString({
                      action: "subjects",
                      termId: termId,
                    }),
                );
              }}
            >
              <UsersIcon />
              Professeurs / Matières
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!termId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                router.push(
                  `/classrooms/${params.id}/reportcards?` +
                    createQueryString({
                      action: "teacher",
                      termId: termId,
                    }),
                );
              }}
            >
              <UserIcon />
              Prof. Principal
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!termId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                router.push(
                  `/classrooms/${params.id}/reportcards?` +
                    createQueryString({
                      action: "overall_appreciation",
                      termId: termId,
                    }),
                );
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
                if (!termId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                router.push(
                  `/classrooms/${params.id}/reportcards?` +
                    createQueryString({
                      action: "class_council",
                      termId: termId,
                    }),
                );
              }}
            >
              <HugeiconsIcon icon={MentoringIcon} strokeWidth={2} />
              Conseil de classe
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!termId) {
                  toast.warning("Veuillez choisir une période");
                  return;
                }
                router.push(
                  `/classrooms/${params.id}/reportcards?` +
                    createQueryString({
                      action: "skills",
                      termId: termId,
                    }),
                );
              }}
            >
              <EnrollmentIcon />
              Compétences évaluées
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
