"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  BookOpen,
  BookOpenCheck,
  BookX,
  MoreVertical,
  PlusIcon,
} from "lucide-react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { BookSelector } from "../BookSelector";
import { CreateEditLoan } from "./CreateEditLoan";
export function LoanHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const { openSheet } = useSheet();
  const canCreateLoan = useCheckPermission("library", PermissionAction.CREATE);
  return (
    <div className="grid md:flex flex-row items-center gap-4 px-4 py-1 border-y">
      <div className="flex flex-row items-center gap-2">
        <Label>{t("books")}</Label>
        <BookSelector
          onChange={(val) => {
            router.push(
              `/library?${createQueryString({ bookId: val, tab: "tab-3" })}`,
            );
          }}
        />
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Label>{t("status")}</Label>
        <Select
          onValueChange={(val) => {
            router.push(
              `/library?${createQueryString({ status: val, tab: "tab-3" })}`,
            );
          }}
        >
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder={t("filter_by_status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="borrowed">
              <BookOpen />
              {t("books_borrowed")}
            </SelectItem>
            <SelectItem value="returned">
              <BookOpenCheck />
              {t("returned_books")}
            </SelectItem>
            <SelectItem value="overdue">
              <BookX />
              {t("overdue_books")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="ml-auto flex gap-2 flex-row items-center">
        {canCreateLoan && (
          <Button
            onClick={() => {
              openSheet({
                title: t("create_a_book_loan"),
                view: <CreateEditLoan />,
              });
            }}
            size={"sm"}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="size-8" variant={"outline"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
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
