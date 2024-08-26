"use client";

import { useParams } from "next/navigation";
import { Forward, MoreVertical, Plus, Reply } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Separator } from "@repo/ui/separator";

import { routes } from "~/configs/routes";
import { MakePaymentBreadCrumb } from "./breadcrumb";

export default function MakePaymentToolbar() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center gap-4 border-b bg-muted/50 px-4 py-1">
      <MakePaymentBreadCrumb />
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            router.push(routes.students.transactions.create(params.id));
          }}
          size="icon"
          variant="outline"
          className="h-8 gap-1"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button size="icon" variant="outline" className="h-8 gap-1">
          <Reply className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-8 gap-1">
          <Forward className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Trash</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
