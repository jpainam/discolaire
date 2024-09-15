"use client";

import { useParams } from "next/navigation";
import { CircleDollarSignIcon, MoreVertical, Plus } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";

export default function FinanceHeader() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const classroomQuery = api.student.classroom.useQuery(params.id);

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
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
