"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileTextIcon, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function SubjectHeader() {
  const trpc = useTRPC();
  const params = useParams<{ subjectId: string }>();
  const t = useTranslations();
  const { data: subject } = useSuspenseQuery(
    trpc.subject.get.queryOptions(Number(params.subjectId)),
  );
  return (
    <div className="bg-muted/50 flex flex-row items-center justify-between gap-6 border-b px-4 py-1">
      <div className="flex flex-row items-center gap-2">
        <FileTextIcon className="size-4" />
        <Label>{t("subject")}</Label>
      </div>
      <div>{subject.course.name}</div>
      <Label>Prof. {getFullName(subject.teacher)}</Label>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <MoreVertical className="size-4" />
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
