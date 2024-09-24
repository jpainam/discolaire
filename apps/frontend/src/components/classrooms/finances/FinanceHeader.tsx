"use client";

import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { ChevronDown, Printer } from "lucide-react";
import { useQueryState } from "nuqs";
import { PiGridFour, PiListBullets } from "react-icons/pi";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { sidebarIcons } from "../sidebar-icons";
import { FinanceBulkAction } from "./FinanceBulkAction";

export function FinanceHeader() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  //const { createQueryString } = useCreateQueryString();
  const [_, setType] = useQueryState("type");
  const [search, setSearch] = useQueryState("query");

  const selectedStudents = useAtomValue(selectedStudentIdsAtom);
  const Icon = sidebarIcons.financial_situation;
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("financial_situation")}</Label>
      <Input
        onChange={(v) => setSearch(v.target.value)}
        className="w-64"
        defaultValue={search ?? ""}
        placeholder={t("search")}
      />

      <RadioGroup
        onValueChange={(val) => {
          void setType(val == "all" ? null : val);
        }}
        className="flex flex-row"
        defaultValue={searchParams.get("type") ?? "all"}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="r1" />
          <Label htmlFor="r1">{t("all")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="debit" id="r2" />
          <Label htmlFor="r2">{t("debit")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit" id="r3" />
          <Label htmlFor="r3">{t("credit")}</Label>
        </div>
      </RadioGroup>

      <div className="ml-auto flex items-center gap-1">
        <CreditOrDebit />
        <FinanceBulkAction />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="flex flex-row items-center gap-1"
            >
              <Printer className="h-4 w-4" />
              <span className="text-xs">{t("print")}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <XMLIcon className="h-4 w-4" />
                <span className="px-2">{t("xml_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span>{t2("financial_situation")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theDebtorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theCreditorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedStudents.length == 0}>
                    {t2("currentSelection")} ({selectedStudents.length})
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PDFIcon className="h-4 w-4" />
                <span className="px-2">{t("pdf_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span> {t2("financial_situation")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theDebtorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theCreditorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedStudents.length == 0}>
                    {t2("currentSelection")} ({selectedStudents.length})
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function CreditOrDebit() {
  const [view, setView] = useQueryState("view");

  const options = [
    {
      value: "list",
      label: <PiListBullets className="h-6 w-6" />,
    },
    {
      value: "grid",
      label: <PiGridFour className="h-6 w-6" />,
    },
  ];
  return (
    <ToggleGroup
      size={"sm"}
      defaultValue={view ?? "list"}
      onValueChange={(val) => {
        void setView(val);
      }}
      type="single"
    >
      {options.map((option) => (
        <ToggleGroupItem value={option.value}>{option.label}</ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
