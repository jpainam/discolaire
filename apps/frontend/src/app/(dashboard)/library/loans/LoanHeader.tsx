"use client";

import {
  BookOpen,
  BookOpenCheck,
  BookX,
  MoreVertical,
  PlusIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { BookSelector } from "../BookSelector";
import { CreateEditLoan } from "./CreateEditLoan";

export function LoanHeader() {
  const t = useTranslations();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const { openModal } = useModal();
  const canCreateLoan = useCheckPermission("library.create");
  return (
    <div className="grid flex-row items-center gap-4 border-y px-4 py-1 md:flex">
      <div className="flex w-full flex-row items-center gap-2">
        <Label>{t("books")}</Label>
        <BookSelector
          className="w-full"
          onChange={(val) => {
            router.push(
              `/library?${createQueryString({ bookId: val, tab: "tab-3" })}`,
            );
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("status")}</Label>
        <Select
          onValueChange={(val) => {
            router.push(
              `/library?${createQueryString({ status: val, tab: "tab-3" })}`,
            );
          }}
        >
          <SelectTrigger className="w-full xl:w-[380px]">
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
      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateLoan && (
          <Button
            onClick={() => {
              openModal({
                title: t("create_a_book_loan"),
                view: <CreateEditLoan />,
              });
            }}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
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
