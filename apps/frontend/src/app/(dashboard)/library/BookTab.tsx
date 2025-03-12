"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { LibraryBigIcon, MoreVerticalIcon, PlusIcon } from "lucide-react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";
import { BookDataTable } from "./BookDataTable";
import { CreateEditBook } from "./CreateEditBook";
export function BookTab() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const bookQuery = api.book.recentlyUsed.useQuery();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row px-4 border-y py-1 bg-muted/50 items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <LibraryBigIcon />
          <Label>{t("materials")}</Label>
        </div>
        <div className="flex flex-row items-center gap-2">
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
