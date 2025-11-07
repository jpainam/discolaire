"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";

import { SubjectSessionBoard } from "~/components/classrooms/subjects/SubjectSessionBoard";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function TeachingSessionCoverage({
  defaultSubjectId,
}: {
  defaultSubjectId: number;
}) {
  const [subjectId] = useQueryState(
    "subjectId",
    parseAsInteger.withDefault(defaultSubjectId),
  );
  const trpc = useTRPC();
  const subjectQuery = useQuery(trpc.subject.get.queryOptions(subjectId));
  const subject = subjectQuery.data;
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted/50 flex flex-row items-center justify-between border-y px-4 py-2">
        {subjectQuery.isPending ? (
          <Skeleton className="h-8 w-96" />
        ) : (
          <Link
            className="text-sm leading-none font-medium hover:underline"
            href={`/staffs/${subject?.teacherId}`}
          >
            {subject?.teacher?.prefix} {getFullName(subject?.teacher)}
          </Link>
        )}
        {subjectQuery.isPending ? (
          <Skeleton className="h-8 w-56" />
        ) : (
          <Label className="font-bold">{subjectQuery.data?.course.name}</Label>
        )}
        <div className="flex flex-row items-center gap-2">
          <Button size={"sm"} variant={"secondary"}>
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button size={"sm"} variant={"secondary"}>
            <XMLIcon />
            {t("xml_export")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="size-8" size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <SubjectSessionBoard
        className="grid grid-cols-3 gap-4 px-4 py-2"
        subjectId={subjectId}
      />
    </div>
  );
}
