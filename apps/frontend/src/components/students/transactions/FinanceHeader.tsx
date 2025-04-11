"use client";

import { CircleDollarSignIcon, MoreVertical, Plus } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";

export default function FinanceHeader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const trpc = useTRPC();
  const classroomQuery = useQuery(
    trpc.student.classroom.queryOptions({
      studentId: params.id,
    }),
  );

  return (
    <div className="flex flex-row items-center gap-4 bg-muted/50 px-2 py-1">
      <div className="flex flex-row items-center gap-2">
        <CircleDollarSignIcon className="h-4 w-4" />
        <Label>{t("transactions")}</Label>
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        {classroomQuery.data && (
          <Button
            onClick={() => {
              router.push(routes.students.transactions.create(params.id));
            }}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
