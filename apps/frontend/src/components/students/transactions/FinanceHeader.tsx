"use client";

import { useParams } from "next/navigation";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { useLocale } from "~/hooks/use-locale";
import { useRouter } from "~/hooks/use-router";
import { FinanceBreadCrumb } from "./breadcrumb";

export default function FinanceHeader() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center gap-4 bg-muted/50 px-2 py-1">
      <FinanceBreadCrumb />
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            router.push(routes.students.transactions.create(params.id));
          }}
          size="icon"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
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
