"use client";

import { useQuery } from "@tanstack/react-query";
import { LibraryBigIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTableSkeleton } from "~/components/datatable/data-table-skeleton";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { BookDataTable } from "./BookDataTable";
import { CreateEditBook } from "./CreateEditBook";

export function BookTab() {
  const t = useTranslations();
  const { openSheet } = useSheet();
  const trpc = useTRPC();
  const bookQuery = useQuery(trpc.book.recentlyUsed.queryOptions());
  const canCreateBook = useCheckPermission("library", PermissionAction.CREATE);

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-muted/50 flex flex-row items-center justify-between border-y px-4 py-1">
        <div className="flex flex-row items-center gap-2">
          <LibraryBigIcon />
          <Label>{t("materials")}</Label>
        </div>
        <div className="flex flex-row items-center gap-2">
          {canCreateBook && (
            <Button
              size={"sm"}
              onClick={() => {
                openSheet({
                  title: t("create_a_new_book"),
                  view: <CreateEditBook />,
                });
              }}
            >
              <PlusIcon />
              {t("add")}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="size-8">
                <MoreVerticalIcon />
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
      <Separator />
      <div className="px-4">
        {bookQuery.isPending && (
          <DataTableSkeleton rowCount={8} columnCount={4} />
        )}
        {bookQuery.data && <BookDataTable books={bookQuery.data} />}
      </div>
    </div>
  );
}
